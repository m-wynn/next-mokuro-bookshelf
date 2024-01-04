import crypto from 'crypto';
import prisma from 'db';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { auth } from 'auth/lucia';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json(
      { error: 'Not authorized to upload' },
      { status: 403 },
    );
  }

  const req = await request.formData();
  let volumeId = parseInt(req.get('volumeId') as string);
  let number = parseInt(req.get('number') as string);
  let ocr = req.get('ocr') as Blob | null;
  let file = req.get('file') as Blob;

  if (volumeId == null || number == null || file == null) {
    throw new Error('Missing required fields');
  }

  let ocrData = ocr != null ? JSON.parse(await ocr.text()) : null;

  const fileData = Buffer.from(await file.arrayBuffer());
  const fileName = getFileHash(fileData);

  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${volumeId}/${fileName}`,
    fileData,
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
      fileName: fileName,
      uploadedById: session.user.userId,
    },
    create: {
      number: number,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: fileName,
      uploadedById: session.user.userId,
    },
  });

  return NextResponse.json(page);
}

const getFileHash = (fileData: Buffer): string => {
  const hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
};
