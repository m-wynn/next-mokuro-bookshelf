import { lucia } from 'lucia';
import { prisma } from '@lucia-auth/adapter-prisma';
import { nextjs_future as nextjsFuture } from 'lucia/middleware';
import { PrismaClient } from '@prisma/client';

import { cache } from 'react';
import * as context from 'next/headers';

const client = new PrismaClient();

export const auth = lucia({
  adapter: prisma(client, {
    user: 'user', // model User {}
    key: 'key', // model Key {}
    session: 'session', // model Session {}
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: nextjsFuture(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => ({
    name: data.name,
    role: data.role,
  }),
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest('GET', context);
  return authRequest.validate();
});
