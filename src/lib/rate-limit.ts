import { createHash } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;
const DUPLICATE_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

type Bucket = { timestamps: number[]; fingerprints: Map<string, number> };
const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

export function createFingerprint(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export function checkRateLimit(
  key: string,
  fingerprint: string,
  now = Date.now(),
): RateLimitResult {
  const bucket = buckets.get(key) ?? {
    timestamps: [],
    fingerprints: new Map<string, number>(),
  };

  bucket.timestamps = bucket.timestamps.filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );
  for (const [entry, timestamp] of bucket.fingerprints) {
    if (now - timestamp >= DUPLICATE_MS) bucket.fingerprints.delete(entry);
  }

  const duplicateAt = bucket.fingerprints.get(fingerprint);
  if (duplicateAt) {
    return {
      allowed: false,
      retryAfter: Math.ceil((DUPLICATE_MS - (now - duplicateAt)) / 1000),
    };
  }

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil(
        (WINDOW_MS - (now - bucket.timestamps[0])) / 1000,
      ),
    };
  }

  bucket.timestamps.push(now);
  bucket.fingerprints.set(fingerprint, now);
  buckets.set(key, bucket);
  return { allowed: true };
}

export function resetRateLimitForTests() {
  buckets.clear();
}
