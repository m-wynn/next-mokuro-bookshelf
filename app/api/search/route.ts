import prisma from 'db';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // const { searchParams } = new URL(request.url);
  // const q = searchParams.get("q");
  //
  // if (q != null) {
  //   const pages = await prisma.page.findMany({
  //     where: {
  //       ocr: {
  //         path: ["blocks", "lines"],
  //         string_contains: q,
  //       },
  //     },
  //     select: {
  //       volumeId: true,
  //       number: true,
  //     },
  //   });
  //
  //   if (pages == null) {
  //     return NextResponse.json({ error: "No such lines" }, { status: 404 });
  //   }
  //
  //   return NextResponse.json(pages);
  // }
  return NextResponse.json({ error: 'Missing query' }, { status: 400 });
}
