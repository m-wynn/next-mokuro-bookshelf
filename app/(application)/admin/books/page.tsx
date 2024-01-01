import { Prisma } from "@prisma/client";
import prisma from "db";
import React from "react";
import SeriesTable from "./SeriesTable";

const volumeSelect = {
  number: true,
  createdAt: true,
  updatedAt: true,
  cover: true,
  uploadedBy: {
    select: {
      name: true,
    },
  },
  _count: {
    select: {
      readings: true,
    },
  },
} satisfies Prisma.VolumeSelect;

export type VolumePayload = Prisma.VolumeGetPayload<{
  select: typeof volumeSelect;
}>;

const seriesSelect = {
  id: true,
  japaneseName: true,
  englishName: true,
  createdAt: true,
  updatedAt: true,
  volumes: {
    select: volumeSelect,
  },
} satisfies Prisma.SeriesSelect;

export type SeriesPayload = Prisma.SeriesGetPayload<{
  select: typeof seriesSelect;
}>;

const Users = async () => {
  const series = await prisma.series.findMany({
    select: seriesSelect,
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="overflow-x-auto">
      <SeriesTable series={series} />
    </div>
  );
};

export default Users;
