import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact-schema";
import {
  checkRateLimit,
  createFingerprint,
} from "@/lib/rate-limit";
import { sendTelegramMessage } from "@/lib/telegram";

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_TIME_MS = 1_500;

function errorResponse(
  code: "VALIDATION_ERROR" | "RATE_LIMITED" | "DELIVERY_FAILED",
  status: number,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json({ ok: false, code, ...extra }, { status });
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES || !isSameOrigin(request)) {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", 400, {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  if (Date.now() - parsed.data.formStartedAt < MIN_FILL_TIME_MS) {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  const fingerprint = createFingerprint(
    [
      parsed.data.firstName,
      parsed.data.telegram,
      parsed.data.phone,
      parsed.data.message,
    ]
      .join("|")
      .toLowerCase(),
  );
  const rateLimit = checkRateLimit(getClientIp(request), fingerprint);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  try {
    await sendTelegramMessage(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact delivery failed", {
      reason: error instanceof Error ? error.message : "UNKNOWN",
    });
    return errorResponse("DELIVERY_FAILED", 502);
  }
}
