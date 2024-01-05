import { auth } from 'auth/lucia';
import prisma from 'db';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (q != null) {
    const pages = await prisma.page.findMany({
      where: {
        ocr: {
          path: ['blocks', 'lines'],
          string_contains: q,
        },
      },
      select: {
        volumeId: true,
        number: true,
      },
    });

    if (pages == null) {
      return NextResponse.json({ error: 'No such lines' }, { status: 404 });
    }

    return NextResponse.json(pages);
  }
  return NextResponse.json({ error: 'Missing query' }, { status: 400 });
}
