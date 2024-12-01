import prisma from 'db';
import { promises as fs } from 'fs';
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

  const volumeIdNoExtension = volumeId.split('.')[0];
  const volume = await prisma.volume.findUnique({
    where: { id: Number(volumeIdNoExtension) },
    select: {
      id: true,
      epub: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!volume) {
    return NextResponse.json({ error: 'Volume not found' }, { status: 404 });
  }

  const file = await fs.readFile(`${process.env.IMAGE_PATH}/${volume.id}/epub`);

  const headers = new Headers();

  headers.set('Content-Type', 'application/epub+zip');

  // cache for a week
  headers.set('Cache-Control', 'public, max-age=604800, immutable');
  return new NextResponse(file, { status: 200, statusText: 'OK', headers });
}
