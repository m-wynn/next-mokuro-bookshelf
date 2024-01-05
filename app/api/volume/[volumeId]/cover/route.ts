import prisma from 'db';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from 'auth/lucia';
import * as context from 'next/headers';

export async function GET(
  request: NextRequest,
  { params: { volumeId } }: { params: { volumeId: string } },
) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
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
