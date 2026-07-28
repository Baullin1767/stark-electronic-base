import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { resetRateLimitForTests } from "@/lib/rate-limit";

const payload = {
  firstName: "Александр",
  lastName: "Иванов",
  profession: "Подолог",
  telegram: "@example_user",
  phone: "",
  message: "Нужна база",
  selectedPlan: "Первичное подключение",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 5_000,
};

function request(body: unknown, ip = "127.0.0.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost",
      origin: "http://localhost",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    resetRateLimitForTests();
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "42";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delivers a valid request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    );
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("returns field errors for invalid data", async () => {
    const response = await POST(
      request({ ...payload, firstName: "", telegram: "", phone: "" }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: "VALIDATION_ERROR",
    });
  });

  it("silently accepts a honeypot submission without delivery", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ ...payload, website: "spam.test" }));
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a safe delivery error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 500 })),
    );
    const response = await POST(request(payload, "127.0.0.2"));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      ok: false,
      code: "DELIVERY_FAILED",
    });
  });

  it("rate limits duplicate requests", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    );
    await POST(request(payload, "127.0.0.3"));
    const response = await POST(request(payload, "127.0.0.3"));
    expect(response.status).toBe(429);
  });
});
