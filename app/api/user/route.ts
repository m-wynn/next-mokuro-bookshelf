import prisma from "db";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request): Promise<NextResponse> {
  const users = await prisma.user.findMany();
  return NextResponse.json({ users }, { status: 200 });
}
