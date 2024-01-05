import { auth } from 'auth/lucia';
import crypto from 'crypto';
import prisma from 'db';
import { promises as fs } from 'fs';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const getFileHash = (fileData: Buffer): string => {
  const hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
};

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
  const volumeId = +(req.get('volumeId') as string);
  const number = +(req.get('number') as string);
  const ocr = req.get('ocr') as Blob | null;
  const file = req.get('file') as Blob;

  if (volumeId == null || number == null || file == null) {
    throw new Error('Missing required fields');
  }

  const ocrData = ocr != null ? JSON.parse(await ocr.text()) : null;

  const fileData = Buffer.from(await file.arrayBuffer());
  const fileName = getFileHash(fileData);

  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${volumeId}/${fileName}`,
    fileData,
  );

  const page = await prisma.page.upsert({
    where: {
      volumeNum: {
        number,
        volumeId,
      },
    },
    update: {
      number,
      volumeId,
      ocr: ocrData,
      fileName,
      uploadedById: session.user.userId,
    },
    create: {
      number,
      volumeId,
      ocr: ocrData,
      fileName,
      uploadedById: session.user.userId,
    },
  });

  return NextResponse.json(page);
}
