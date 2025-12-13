import prisma from 'db';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { validateApiSession } from 'auth/context-adapter';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const session = await validateApiSession(request.method);
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const { pageId } = await params;
  const page = await prisma.page.findUnique({
    where: {
      id: +pageId,
    },
    select: {
      volumeId: true,
      fileName: true,
    },
  });

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const file = await fs.readFile(
    `${process.env.IMAGE_PATH}/${page.volumeId}/${page.fileName}`,
  );

  const headers = new Headers();

  headers.set('Content-Type', 'image/*');

  // cache for a week
  headers.set('Cache-Control', 'public, max-age=604800, immutable');
  return new NextResponse(file, { status: 200, statusText: 'OK', headers });
}
