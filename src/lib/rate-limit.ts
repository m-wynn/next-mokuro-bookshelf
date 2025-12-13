import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  // Disable rate limiting when DISABLE_RATE_LIMIT is set (for E2E tests)
  // This keeps rate limiting active in all standard environments (dev, test, prod)
  // unless explicitly disabled for testing purposes
  const isRateLimitDisabled = process.env.DISABLE_RATE_LIMIT === 'true';

  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) => new Promise<void>((resolve, reject) => {
      // Skip rate limiting if explicitly disabled
      if (isRateLimitDisabled) {
        resolve();
        return;
      }

      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= limit;

      if (isRateLimited) {
        reject();
      } else {
        resolve();
      }
    }),
  };
}
