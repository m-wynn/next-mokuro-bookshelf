import { LoginForm } from 'auth';
import { auth } from 'auth/lucia';
import rateLimit from 'lib/rate-limit';
import { LuciaError } from 'lucia';
import * as context from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 5,
});

export const POST = async (request: NextRequest) => {
  try {
    await limiter.check(5, 'LOGIN_RATE_LIMIT');
  } catch (e) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const { username, password }: LoginForm = await request.json();

  try {
    const key = await auth.useKey('username', username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === 'AUTH_INVALID_KEY_ID' ||
        e.message === 'AUTH_INVALID_PASSWORD')
    ) {
      return NextResponse.json(
        { error: 'Incorrect username or password' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 },
    );
  }
};
