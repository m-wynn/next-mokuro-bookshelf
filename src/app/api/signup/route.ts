import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignupForm } from 'auth';
import { auth } from 'auth/lucia';
import { setApiSession } from 'auth/context-adapter';
import prisma from 'db';
import rateLimit from 'lib/rate-limit';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import { env } from 'process';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 5,
});

export const POST = async (request: NextRequest) => {
  try {
    await limiter.check(5, 'SIGNUP_RATE_LIMIT');
  } catch (_e) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const {
    username, password, confirmPassword, inviteCode,
  }: SignupForm = await request.json();

  if (password.length < 8) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: 'Passwords do not match' },
      { status: 400 },
    );
  }

  if (inviteCode !== env.INVITE_CODE) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  }

  try {
    const userCount = await prisma.user.count();
    const user = await auth.createUser({
      key: {
        providerId: 'username', // auth method
        providerUserId: username.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        name: username,
        role: userCount === 0 ? 'ADMIN' : 'READER', // first user is admin
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    await setApiSession(request.method, session);
    return NextResponse.json('User Created', { status: 201 });
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError
      && e.code === 'P2002' // Unique constraint failed
    ) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 },
    );
  }
};
