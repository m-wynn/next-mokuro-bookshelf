import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  // Disable rate limiting only in test environment to speed up E2E tests
  // Keep it enabled in development to better simulate production conditions
  const isTest = process.env.NODE_ENV === 'test';
  
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) => new Promise<void>((resolve, reject) => {
      // Skip rate limiting in test environment only
      if (isTest) {
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
