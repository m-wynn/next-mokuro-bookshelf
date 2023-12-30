import { auth } from "auth/lucia";
import * as context from "next/headers";
import prisma from "db";
import { ReadingStatus } from "@prisma/client";
import Bookshelf from "./Bookshelf";
import { readingSelect } from "lib/reading";

const Page = async () => {
  const updateReadingStatus = async (id: number, status: ReadingStatus) => {
    "use server";
    return await prisma.reading.update({
      where: {
        id,
      },
      data: {
        status,
      },
      select: readingSelect,
    });
  };

  async function removeReading(id: number) {
    "use server";
    return await prisma.reading.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      select: readingSelect,
    });
  }

  return (
    <Bookshelf
      updateReadingStatus={updateReadingStatus}
      removeReading={removeReading}
    />
  );
};

export default Page;
