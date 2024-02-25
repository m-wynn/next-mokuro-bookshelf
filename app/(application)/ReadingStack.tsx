import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBook,
  faBookOpen,
  faCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import VolumeCard from '@/volumecard';
import { ReadingStatus } from '@prisma/client';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import type { Reading } from 'lib/reading';
import { updateReadingStatus, removeReading, setReadingVolume } from './functions';

export function ReadingStack({ reading } : { reading: Reading }) {
  const volume = reading.series.volumes.find(
    (v) => v.number === reading.volumeNum,
  ) ?? reading.series.volumes[0];
  const { userSettings } = useGlobalContext();
  const useJapaneseTitle = userSettings?.useJapaneseTitle ?? false;
  const [expanded, setExpanded] = React.useState(false);
  const { setAllReadings } = useGlobalContext();

  const updateReadingStatusAndState = async (
    id: number,
    status: ReadingStatus,
  ) => {
    const newReading = await updateReadingStatus(id, status);
    setAllReadings((prev: Reading[]) => {
      const newReadings = prev.map((r) => (r.id === id ? newReading : r));
      return newReadings;
    });
  };

  const setReadingVolumeAndState = async (
    id: number,
    volumeNum: number,
  ) => {
    const newReading = await setReadingVolume(id, volumeNum);
    setAllReadings((prev: Reading[]) => {
      const newReadings = prev.map((r) => (r.id === id ? newReading : r));
      return newReadings;
    });
  };

  const removeReadingAndState = async (id: number) => {
    await removeReading(id);
    setAllReadings((prev: Reading[]) => prev.filter((r) => r.id !== id));
  };
  const seriesName = useJapaneseTitle && reading.series.japaneseName
    ? reading.series.japaneseName
    : reading.series.englishName;

  return (
    <div className={expanded ? 'm-3 p-3 bg-base-300' : ''} key={reading.series.id}>
      {expanded && (
        <div className="flex flex-row">
          <button type="button" className="btn btn-primary" onClick={() => setExpanded(!expanded)}>Collapse</button>
          <h1 className="mb-4 text-4xl font-bold text">{seriesName}</h1>
        </div>
      )}
      <div className={expanded ? 'flex flex-row flex-wrap' : 'stack'}>
        <VolumeCard
          key={volume.id}
          coverUri={`/api/volume/${volume.id}/cover`}
          pagesRead={reading.page}
          totalPages={volume._count.pages}
          href={`/reader/${volume.series.id}/${volume.number}`}
          seriesName={
              useJapaneseTitle && volume.series.japaneseName
                ? volume.series.japaneseName
                : volume.series.englishName
            }
          volumeNumber={volume.number}
        >
          <details className="dropdown dropdown-end">
            <summary className="btn btn-square btn-ghost">
              <FontAwesomeIcon icon={faBars} />
            </summary>
            <ul className="z-50 p-2 w-52 shadow menu dropdown-content bg-base-100 rounded-box">
              {reading.status !== ReadingStatus.UNREAD && (
              <li>
                <button
                  type="button"
                  onClick={() => updateReadingStatusAndState(reading.id, ReadingStatus.UNREAD)}
                >
                  <FontAwesomeIcon icon={faBook} />
                  {' '}
                  Mark as Unread
                </button>
              </li>
              )}
              {reading.status !== ReadingStatus.READING && (
              <li>
                <button
                  type="button"
                  onClick={() => updateReadingStatusAndState(reading.id, ReadingStatus.READING)}
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  {' '}
                  Mark as Reading
                </button>
              </li>
              )}
              {reading.status !== ReadingStatus.READ && (
              <li>
                <button
                  type="button"
                  onClick={() => updateReadingStatusAndState(reading.id, ReadingStatus.READ)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  {' '}
                  Mark as Read
                </button>
              </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => removeReadingAndState(reading.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  {' '}
                  Remove
                </button>
              </li>
            </ul>
          </details>
        </VolumeCard>
        {reading.series.volumes.filter(
          (v) => v.number !== reading.volumeNum,
        ).slice(0, 5).map((v) => (
          <VolumeCard
            key={v.id}
            coverUri={`/api/volume/${v.id}/cover`}
            pagesRead={reading.page}
            totalPages={v._count.pages}
            href={`/reader/${v.series.id}/${v.number}`}
            seriesName={useJapaneseTitle && v.series.japaneseName
              ? v.series.japaneseName
              : v.series.englishName}
            volumeNumber={v.number}
            onClick={() => setExpanded(true)}
          >
            <details className="dropdown dropdown-end">
              <summary className="btn btn-square btn-ghost">
                <FontAwesomeIcon icon={faBars} />
              </summary>
              <ul className="z-50 p-2 w-52 shadow menu dropdown-content bg-base-100 rounded-box">
                <li>
                  <button
                    type="button"
                    onClick={() => setReadingVolumeAndState(reading.id, v.number)}
                  >
                    <FontAwesomeIcon icon={faBookOpen} />
                    {' '}
                    Set as active volume
                  </button>
                </li>
              </ul>
            </details>
          </VolumeCard>
        ))}
      </div>
    </div>
  );
}
