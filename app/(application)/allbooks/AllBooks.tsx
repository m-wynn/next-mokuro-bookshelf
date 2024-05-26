'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useMemo } from 'react';
import VolumeCard from '@/volumecard';
import AllUserProgressMenu from '@/AllUserProgressMenu';
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
          <div key={id} className="mb-4 w-full">
            <div className="flex-initial p-4 w-full shadow-md bg-base-200">
              <h3 className="mb-2 text-3xl font-bold">{name}</h3>
              <div key={id} className="flex flex-wrap mb-4 w-full">
                {volumes?.map((volume) => (
                  <VolumeCard
                    key={volume.id}
                    coverUri={`/api/volume/${volume.id}/cover`}
                    pagesRead={volume.readings[0]?.page ?? 0}
                    totalPages={volume._count.pages}
                    href={`/reader/${id}/${volume.number}`}
                    seriesName={name}
                    volumeNumber={volume.number}
                  >
                    <details className="dropdown dropdown-end">
                      <summary className="btn btn-square btn-ghost">
                        <FontAwesomeIcon icon={faBars} />
                      </summary>
                      <ul className="z-50 p-2 w-52 shadow menu dropdown-content bg-base-100 rounded-box">
                        <AllUserProgressMenu volumeId={volume.id} />
                      </ul>
                    </details>
                  </VolumeCard>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
