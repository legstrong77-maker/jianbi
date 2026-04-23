// Best-effort in-memory rate limiter for demo mode.
// Note: Vercel serverless functions may reset this between invocations,
// so actual limits are "≤ LIMIT per warm instance" not a hard global cap.
// For a portfolio demo that's fine — Gemini's own 15 RPM / 1000 RPD
// on the server-side key is the ultimate backstop.

interface Hit {
  times: number[];
}

const store = new Map<string, Hit>();
const MAX_KEYS = 1000; // Prevent unbounded growth

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup when map gets too big
  if (store.size > MAX_KEYS) {
    for (const [k, v] of store.entries()) {
      const stillValid = v.times.filter((t) => now - t < windowMs);
      if (stillValid.length === 0) store.delete(k);
      else v.times = stillValid;
      if (store.size <= MAX_KEYS / 2) break;
    }
  }

  const hit = store.get(key) ?? { times: [] };
  hit.times = hit.times.filter((t) => now - t < windowMs);

  if (hit.times.length >= limit) {
    const oldest = Math.min(...hit.times);
    const resetInSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  hit.times.push(now);
  store.set(key, hit);
  return {
    allowed: true,
    remaining: limit - hit.times.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}

export function getClientIp(headers: Headers): string {
  // Vercel / most proxies put the real IP here
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
