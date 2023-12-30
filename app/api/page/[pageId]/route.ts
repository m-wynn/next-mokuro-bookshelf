import prisma from "db";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth/lucia";
import * as context from "next/headers";
export async function GET(
  request: NextRequest,
  { params: { pageId } }: { params: { pageId: string } },
) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const page = await prisma.page.findUnique({
    where: {
      id: parseInt(pageId),
    },
    select: {
      volumeId: true,
      fileName: true,
    },
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const file = await fs.readFile(
    `${process.env.IMAGE_PATH}/${page.volumeId}/${page.fileName}`,
  );

  const headers = new Headers();

  headers.set("Content-Type", "image/*");

  // cache for a week
  headers.set("Cache-Control", "public, max-age=604800, immutable");
  return new NextResponse(file, { status: 200, statusText: "OK", headers });
}
