import prisma from 'db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'auth/lucia';
import * as context from 'next/headers';

export async function GET(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const readings = await prisma.reading.findMany({
    where: {
      userId: session.user.userId,
    },
    select: {
      id: true,
      page: true,
      status: true,
      updatedAt: true,
      volume: {
        select: {
          number: true,
          id: true,
          seriesId: true,
          cover: true,
          series: {
            select: {
              id: true,
              englishName: true,
              japaneseName: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(readings);
}
