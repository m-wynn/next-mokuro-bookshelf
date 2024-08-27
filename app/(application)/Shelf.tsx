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

import React from 'react';

type ShelfProps = {
  title: string;
  readings: Reading[];
  updateReadingStatus: (
    _readingId: number,
    _status: ReadingStatus,
  ) => Promise<void>;
  removeReading: (_readingId: number) => Promise<void>;
};

function Shelf({
  title,
  readings,
  updateReadingStatus,
  removeReading,
}: ShelfProps) {
<<<<<<< Updated upstream
  const { userSettings } = useGlobalContext();
  const useJapaneseTitle = userSettings?.useJapaneseTitle ?? false;

=======
  const { useJapaneseTitle } = useGlobalContext();
>>>>>>> Stashed changes
  return (
    <div className="p-4 m-4 shadow-lg bg-base-200">
      <h1 className="mb-4 text-4xl font-bold text">{title}</h1>
      <div className="flex flex-wrap mb-6 section">
        {readings.map((reading) => (
          <VolumeCard
            key={reading.volume.id}
            coverUri={`/api/volume/${reading.volume.id}/cover`}
            pagesRead={reading.page}
            totalPages={reading.volume._count.pages}
            href={`/reader/${reading.volume.series.id}/${reading.volume.number}`}
            seriesName={
              useJapaneseTitle && reading.volume.series.japaneseName
                ? reading.volume.series.japaneseName
                : reading.volume.series.englishName
            }
            volumeNumber={reading.volume.number}
          >
            <details className="dropdown dropdown-end">
              <summary className="btn btn-square btn-ghost">
                <FontAwesomeIcon icon={faBars} />
              </summary>
              <ul className="z-50 p-2 w-52 shadow menu dropdown-content bg-base-100 rounded-box">
                {reading.status !== ReadingStatus.UNREAD && (
                  <li>
                    <button
<<<<<<< Updated upstream
                      type="button"
=======
>>>>>>> Stashed changes
                      onClick={() => updateReadingStatus(reading.id, ReadingStatus.UNREAD)}
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
<<<<<<< Updated upstream
                      type="button"
=======
>>>>>>> Stashed changes
                      onClick={() => updateReadingStatus(reading.id, ReadingStatus.READING)}
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
<<<<<<< Updated upstream
                      type="button"
=======
>>>>>>> Stashed changes
                      onClick={() => updateReadingStatus(reading.id, ReadingStatus.READ)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      {' '}
                      Mark as Read
                    </button>
                  </li>
                )}
                <li>
<<<<<<< Updated upstream
                  <button
                    type="button"
                    onClick={() => removeReading(reading.id)}
                  >
=======
                  <button onClick={() => removeReading(reading.id)}>
>>>>>>> Stashed changes
                    <FontAwesomeIcon icon={faTrash} />
                    {' '}
                    Remove
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
export default Shelf;
