import prisma from "db";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "auth/lucia";
import * as context from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (name != null) {
    const series = await prisma.series.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });

    if (series == null) {
      return NextResponse.json({ error: "No such series" }, { status: 404 });
    }
    console.log(series);

    return NextResponse.json(series);
  }
  return NextResponse.json({ error: "Missing name" }, { status: 400 });
}
