import prisma from 'db';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { validateApiSession } from 'auth/context-adapter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ volumeId: string }> },
) {
  const session = await validateApiSession(request.method);
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const { volumeId } = await params;
  const volume = await prisma.volume.findUniqueOrThrow({
    where: {
      id: +volumeId,
    },
    select: {
      cover: true,
    },
  });

  const coverPath = `${process.env.IMAGE_PATH}/${volumeId}/cover/${volume.cover}`;

  const file = await fs.readFile(coverPath);

  const headers = new Headers();

  headers.set('Content-Type', 'image/*');

  // cache for a week
  headers.set('Cache-Control', 'public, max-age=604800, immutable');
  return new NextResponse(file, { status: 200, statusText: 'OK', headers });
}
