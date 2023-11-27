import prisma from "db";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "lib/auth";
import { getServerSession } from "next-auth";

type Params = {
  page: number;
  volumeId: number;
  file: File;
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  if (!(session.user.role in ["ADMIN", "EDITOR"])) {
    return NextResponse.json(
      { error: "Not authorized to upload" },
      { status: 403 },
    );
  }

  const req = await request.formData();
  let volumeId = parseInt(req.get("volumeId") as string);
  let number = parseInt(req.get("number") as string);
  let ocr = JSON.parse(req.get("ocr") as string);
  let file = req.get("file") as Blob;
  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${volumeId}/${number}-${file.name}`,
    Buffer.from(await file.arrayBuffer()),
  );
  prisma.page.create({
    data: {
      number: number,
      volumeId: volumeId,
      ocr: ocr,
      fileName: `${volumeId}/${number}-${file.name}`,
      uploadedById: session.user.id,
    },
  });
}
