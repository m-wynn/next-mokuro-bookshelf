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
    const volume = await prisma.volume.findUnique({
      where: {
        seriesNum: {
          number: +searchParams.get("volume"),
          seriesId: +searchParams.get("series"),
        },
      },
    });
    return NextResponse.json(volume);
  }
  let queryWhere = {
    include: {
      readings: {
        where: {
          userId: searchParams.has("mine") ? session.user.userId : undefined,
        },
      },
    },
  };
  const volumes = await prisma.volume.findMany(queryWhere);
  return NextResponse.json(volumes);
}

export async function POST(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json(
      {
        error: `Not authorized to upload stupid ${session.user.role} is not "ADMIN"`,
      },
      { status: 403 },
    );
  }

  const req = await request.formData();
  let series = req.get("title") as string;
  let number = parseInt(req.get("volumeNumber") as string);
  let cover = req.get("coverImage") as Blob;
  let firstPageIsCover = req.get("firstPageIsCover") === "true";

  if (!series || !number || !cover) {
    throw new Error("Missing required fields");
  }

  let seriesId = await prisma.series.upsert({
    where: {
      name: series,
    },
    update: {},
    create: {
      name: series,
      uploadedById: session.user.userId,
    },
    select: {
      id: true,
    },
  });

  const volume = await prisma.volume.upsert({
    where: {
      seriesNum: {
        number: number,
        seriesId: seriesId.id,
      },
    },
    update: {
      cover: cover.name,
      firstPageIsCover: firstPageIsCover,
    },
    create: {
      cover: cover.name,
      number: number,
      seriesId: seriesId.id,
      uploadedById: session.user.userId,
      firstPageIsCover: firstPageIsCover,
    },
  });

  const coverPath = `${process.env.IMAGE_PATH}/${volume.id}/cover/${cover.name}`;

  await fs.mkdir(coverPath.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });

  await fs.writeFile(coverPath, Buffer.from(await cover.arrayBuffer()));

  return NextResponse.json(volume);
}
