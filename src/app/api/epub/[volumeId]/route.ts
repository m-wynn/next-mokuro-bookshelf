import prisma from 'db';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { validateApiSession } from 'auth/context-adapter';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ volumeId: string }> },
) {
  const session = await validateApiSession(request.method);
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const { volumeId } = await params;
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
