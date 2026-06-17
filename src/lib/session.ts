import { validateApiSession } from 'auth/context-adapter';

export async function getSession(method: string) {
  const session = await validateApiSession(method);
  if (!session) {
    throw new Error('You must be signed in to perform this action');
  }
  return session;
}
