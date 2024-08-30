import prisma from 'db';
import { NextResponse } from 'next/server';
import { auth } from 'auth/lucia';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params: { volumeId } }: { params: { volumeId: string } },
) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const res = await request.json();
  const validSettings = ['useTwoPagesOverride', 'firstPageIsCoverOverride'];
  const toUpdate: Record<string, any> = {};

  validSettings.forEach((key) => {
    if (res[key] !== null) {
      toUpdate[key] = res[key];
    }
  });

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
      ...toUpdate,
    },
    create: {
      volumeId: +volumeId,
      userId: session.user.userId,
      ...toUpdate,
      status: 'READING',
    },
  });

  if (reading == null) {
    return NextResponse.json({ error: 'No such volume' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
