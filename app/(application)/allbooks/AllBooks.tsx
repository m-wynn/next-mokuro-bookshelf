'use client';

import React, { useCallback, useMemo } from 'react';
import VolumeCard from '@/volumecard';
import type { SeriesPayload } from './page';
import { useGlobalContext } from '../GlobalContext';

export function AllBooks({ series }: { series: SeriesPayload[] }) {
  const { userSettings } = useGlobalContext();
  const useJapaneseTitle = userSettings?.useJapaneseTitle ?? false;

  const canUserSeeIfNsfw = useCallback((singleSeries: SeriesPayload) => {
    if (singleSeries.isNsfw && !userSettings.showNsfwContent) {
      return false;
    }
    return true;
  }, [userSettings]);

  const filteredSeries = useMemo(
    () => series.filter((each) => canUserSeeIfNsfw(each)),
    [canUserSeeIfNsfw, series],
  );

  return (
    <>
      {filteredSeries.map(({
        japaneseName, englishName, id, volumes,
      }) => {
        const name = useJapaneseTitle && japaneseName ? japaneseName : englishName;
        return (
          <div key={name} className="mb-4 w-full">
            <div className="flex-initial p-4 w-full shadow-md bg-base-200">
              <h3 className="mb-2 text-3xl font-bold">{name}</h3>
              <div key={name} className="flex flex-wrap mb-4 w-full">
                {volumes?.map((volume) => (
                  <VolumeCard
                    key={volume.id}
                    coverUri={`/api/volume/${volume.id}/cover`}
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
}
