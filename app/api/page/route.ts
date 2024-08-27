import crypto from 'crypto';
import prisma from 'db';
import { promises as fs } from 'fs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSession } from 'lib/session';

const getFileHash = (fileData: Buffer): string => {
  const hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
};

export async function POST(request: NextRequest) {
  const session = await getSession('POST');
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Nice try' }, { status: 401 });
  }

<<<<<<< Updated upstream
  const formData = await request.formData();
  const volumeId = +(formData.get('volumeId') as string);
  const number = +(formData.get('number') as string);
  const ocr = formData.get('ocr') as Blob | null;
  const file = formData.get('file') as Blob;
=======
  const req = await request.formData();
  const volumeId = parseInt(req.get('volumeId') as string);
  const number = parseInt(req.get('number') as string);
  const ocr = req.get('ocr') as Blob | null;
  const file = req.get('file') as Blob;
>>>>>>> Stashed changes

  if (volumeId == null || number == null || file == null) {
    throw new Error('Missing required fields');
  }

  const ocrData = ocr != null ? JSON.parse(await ocr.text()) : null;

  const fileData = Buffer.from(await file.arrayBuffer());
  const fileName = getFileHash(fileData);
  const blockText = ocrData?.blocks.map((block: any) => block.lines.join('')) ?? [];

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
      blockText,
    },
  });

  return NextResponse.json(page);
}
