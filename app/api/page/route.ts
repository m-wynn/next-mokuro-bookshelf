import prisma from "db";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth/lucia";
import * as context from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  if (searchParams.has("series") && searchParams.has("volume")) {
    const pages = await prisma.page.findMany({
      where: {
        volume: {
          number: +searchParams.get("volume"),
          seriesId: +searchParams.get("series"),
        },
      },
      select: {
        number: true,
        ocr: true,
        fileName: true,
      },
      orderBy: {
        number: "asc",
      },
    });
    return NextResponse.json(pages);
  }
  return NextResponse.json(
    { error: "Missing series or volume" },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json(
      { error: "Not authorized to upload" },
      { status: 403 },
    );
  }

  const req = await request.formData();
  let volumeId = parseInt(req.get("volumeId") as string);
  let number = parseInt(req.get("number") as string);
  let ocr = req.get("ocr") as Blob | null;
  let file = req.get("file") as Blob;

  if (volumeId == null || number == null || file == null) {
    throw new Error("Missing required fields");
  }

  let ocrData = ocr != null ? JSON.parse(await ocr.text()) : null;

  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${volumeId}/${number}-${file.name}`,
    Buffer.from(await file.arrayBuffer()),
  );

  const page = await prisma.page.upsert({
    where: {
      volumeNum: {
        number: number,
        volumeId: volumeId,
      },
    },
    update: {
      number: number,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: `${number}-${file.name}`,
      uploadedById: session.user.userId,
    },
    create: {
      number: number,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: `${number}-${file.name}`,
      uploadedById: session.user.userId,
    },
  });

  return NextResponse.json(page);
}
