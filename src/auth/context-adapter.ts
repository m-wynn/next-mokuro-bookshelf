// Compatibility adapter for Next.js 16 async headers/cookies with Lucia v2
// This creates a synchronous-looking interface that Lucia expects
// by pre-fetching headers and cookies

import { cookies as nextCookies, headers as nextHeaders } from 'next/headers';

let cachedHeaders: Awaited<ReturnType<typeof nextHeaders>> | null = null;
let cachedCookies: Awaited<ReturnType<typeof nextCookies>> | null = null;

export async function initializeContext() {
  cachedHeaders = await nextHeaders();
  cachedCookies = await nextCookies();
}

export function headers() {
  if (!cachedHeaders) {
    throw new Error('Context not initialized. Call initializeContext() first.');
  }
  return cachedHeaders;
}

export function cookies() {
  if (!cachedCookies) {
    throw new Error('Context not initialized. Call initializeContext() first.');
  }
  return cachedCookies;
}

export function clearContext() {
  cachedHeaders = null;
  cachedCookies = null;
}

// Helper function for API routes to validate session with context initialization
export async function validateApiSession(method: string) {
  await initializeContext();
  try {
    const { auth } = await import('./lucia');
    const context = await import('./context-adapter');
    const session = await auth.handleRequest(method, context).validate();
    return session;
  } finally {
    clearContext();
  }
}

// Helper function for API routes that need to set session (login/signup)
export async function setApiSession(method: string, session: any) {
  await initializeContext();
  try {
    const { auth } = await import('./lucia');
    const context = await import('./context-adapter');
    const authRequest = auth.handleRequest(method, context);
    authRequest.setSession(session);
  } finally {
    clearContext();
  }
}
