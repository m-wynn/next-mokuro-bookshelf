import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  // Disable rate limiting in test/development environments
  const isTestOrDev = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';
  
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) => new Promise<void>((resolve, reject) => {
      // Skip rate limiting in test/development
      if (isTestOrDev) {
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
