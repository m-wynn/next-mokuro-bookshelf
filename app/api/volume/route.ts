import prisma from "db";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "lib/auth";
import { getServerSession } from "next-auth";
import { Volume } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  let queryWhere = {
    include: {
      readings: {
        where: {
          userId: searchParams.has("mine") ? +session.user.id : undefined,
        },
      },
    },
  };
  const volumes = await prisma.volume.findMany(queryWhere);
  return NextResponse.json(volumes);
}

export async function POST(request: NextRequest) {
  console.log("POSTTTT");
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  if (!(session.user.role in ["ADMIN", "EDITOR"])) {
    return NextResponse.json(
      {
        error: `Not authorized to upload stupid ${session.user.role} is not "ADMIN"`,
      },
      { status: 403 },
    );
  }

  const req = await request.formData();
  let book = req.get("title") as string;
  let number = parseInt(req.get("volumeNumber") as string);
  let cover = req.get("coverImage") as Blob;

  if (!book || !number || !cover) {
    throw new Error("Missing required fields");
  }

  let bookId = await prisma.book.upsert({
    where: {
      name: book,
    },
    update: {},
    create: {
      name: book,
      uploadedById: session.user.id,
    },
  });

  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${number}/${cover.name}`,
    Buffer.from(await cover.arrayBuffer()),
  );

  const volume = await prisma.volume.create({
    data: {
      number: number,
      bookId: bookId.id,
      cover: cover.name,
      uploadedById: session.user.id,
    },
  });

  return volume;
}
