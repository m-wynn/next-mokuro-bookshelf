"use server";
import { Prisma } from "@prisma/client";
import prisma from "db";
import { getSession } from "lib/session";

export const updateSeries = async (
  id: number,
  series: Prisma.SeriesUpdateInput,
) => {
  "use server";
  const session = await getSession("POST");
  if (["ADMIN", "EDITOR"].includes(session.user.role)) {
    await prisma.series.update({
      where: {
        id,
      },
      data: series,
    });
  } else {
    throw new Error("Unauthorized");
  }
};
