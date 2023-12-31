import prisma from 'db';
import { NextResponse } from 'next/server';
import { auth } from 'auth/lucia';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params: { volumeId } }: { params: { volumeId: string } },
) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const reading = await prisma.reading.findUnique({
    where: {
      volumeUser: {
        volumeId: +volumeId,
        userId: session.user.userId,
      },
    },
    select: {
      page: true,
    },
  });

  if (reading == null) {
    return NextResponse.json({ page: 0 }, { status: 200 });
  }

  return NextResponse.json(reading);
}

export async function POST(
  request: NextRequest,
  { params: { volumeId } }: { params: { volumeId: string } },
) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const res = await request.json();
  const { page } = res;

  const reading = await prisma.reading.upsert({
    where: {
      volumeUser: {
        volumeId: +volumeId,
        userId: session.user.userId,
      },
    },
    update: {
      volumeId: +volumeId,
      userId: session.user.userId,
      page,
      status: 'READING',
      isActive: true,
    },
    create: {
      volumeId: +volumeId,
      userId: session.user.userId,
      page,
      status: 'READING',
      isActive: true,
    },
  });

  if (reading == null) {
    return NextResponse.json({ error: 'No such volume' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
