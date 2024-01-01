"use client";
import React from "react";
import { SeriesPayload } from "./page";
import { useGlobalContext } from "../GlobalContext";
import VolumeCard from "@/volumecard";

export const AllBooks = ({ series }: { series: SeriesPayload[] }) => {
  const { useJapaneseTitle } = useGlobalContext();
  return (
    <>
      {series.map(({ japaneseName, englishName, id, volumes }) => {
        const name =
          useJapaneseTitle && japaneseName ? japaneseName : englishName;
        return (
          <div key={name} className="mb-4 w-full">
            <div className="flex-initial p-4 w-full shadow-md bg-base-200">
              <h3 className="mb-2 text-3xl font-bold">{name}</h3>
              <div key={name} className="flex flex-wrap mb-4 w-full">
                {volumes?.map((volume) => (
                  <VolumeCard
                    key={volume.id}
                    coverUri={`/api/volume/${volume.id}/cover/`}
                    pagesRead={volume.readings[0]?.page ?? 0}
                    totalPages={volume._count.pages}
                    href={`/reader/${id}/${volume.number}`}
                    seriesName={name}
                    volumeNumber={volume.number}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
