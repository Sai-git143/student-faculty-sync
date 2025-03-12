
import { RateLimitData } from './types.ts';

export const MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Rate limiting cache (in memory for demo purposes)
// In production, use Redis or similar for distributed rate limiting
const rateLimitCache = new Map<string, RateLimitData>();

export function checkRateLimit(ipKey: string): void {
  const now = Date.now();
  const rateData = rateLimitCache.get(ipKey);
  
  if (rateData) {
    // Reset rate limit if window has expired
    if (now - rateData.timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimitCache.set(ipKey, { count: 1, timestamp: now });
    } else if (rateData.count >= MAX_ATTEMPTS) {
      const minutesLeft = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - rateData.timestamp)) / 60000);
      throw new Error(`Too many OTP requests. Please try again after ${minutesLeft} minutes.`);
    } else {
      // Increment counter
      rateLimitCache.set(ipKey, { count: rateData.count + 1, timestamp: rateData.timestamp });
    }
  } else {
    // First attempt
    rateLimitCache.set(ipKey, { count: 1, timestamp: now });
  }
}

export function getRateLimitInfo(ipKey: string): { remainingAttempts: number; windowMs: number } {
  const rateData = rateLimitCache.get(ipKey);
  return {
    remainingAttempts: rateData ? MAX_ATTEMPTS - rateData.count : MAX_ATTEMPTS,
    windowMs: RATE_LIMIT_WINDOW_MS
  };
}

