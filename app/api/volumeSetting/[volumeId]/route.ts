import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth/lucia";
import * as context from "next/headers";

export async function POST(request: NextRequest, { params: { volumeId } }) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const res = await request.json();
  const { useTwoPagesOverride, firstPageIsCoverOverride } = res;

  const toUpdate = {};
  if (useTwoPagesOverride !== null) {
    toUpdate.useTwoPagesOverride = useTwoPagesOverride;
  }
  if (firstPageIsCoverOverride !== null) {
    toUpdate.firstPageIsCoverOverride = firstPageIsCoverOverride;
  }

  const reading = await prisma.reading.upsert({
    where: {
      volumeUser: {
        volumeId: parseInt(volumeId),
        userId: session.user.userId,
      },
    },
    update: {
      volumeId: parseInt(volumeId),
      userId: session.user.userId,
      ...toUpdate
    },
    create: {
      volumeId: parseInt(volumeId),
      userId: session.user.userId,
      ...toUpdate,
      status: "READING",
    },
  });

  if (reading == null) {
    return NextResponse.json({ error: "No such volume" }, { status: 404 });
  }

  return NextResponse.json(reading);
}
