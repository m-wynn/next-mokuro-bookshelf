import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBook,
  faBookOpen,
  faCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import VolumeCard from '@/volumecard';
import { Reading } from 'lib/reading';
import { ReadingStatus } from '@prisma/client';
import { useGlobalContext } from './GlobalContext';

type ShelfProps = {
  title: string;
  readings: Reading[];
  updateReadingStatus: (
    readingId: number,
    status: ReadingStatus,
  ) => Promise<void>;
  removeReading: (readingId: number) => Promise<void>;
};

const Shelf = ({
  title,
  readings,
  updateReadingStatus,
  removeReading,
}: ShelfProps) => {
  const { useJapaneseTitle } = useGlobalContext();
  return (
    <div className="p-4 m-4 shadow-lg bg-base-200">
      <h1 className="mb-4 text-4xl font-bold text">{title}</h1>
      <div className="flex flex-wrap mb-6 section">
        {readings.map((reading) => (
          <VolumeCard
            key={reading.volume.id}
            coverUri={`/api/volume/${reading.volume.id}/cover/`}
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
                      onClick={() =>
                        updateReadingStatus(reading.id, ReadingStatus.UNREAD)
                      }
                    >
                      <FontAwesomeIcon icon={faBook} /> Mark as Unread
                    </button>
                  </li>
                )}
                {reading.status !== ReadingStatus.READING && (
                  <li>
                    <button
                      onClick={() =>
                        updateReadingStatus(reading.id, ReadingStatus.READING)
                      }
                    >
                      <FontAwesomeIcon icon={faBookOpen} /> Mark as Reading
                    </button>
                  </li>
                )}
                {reading.status !== ReadingStatus.READ && (
                  <li>
                    <button
                      onClick={() =>
                        updateReadingStatus(reading.id, ReadingStatus.READ)
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} /> Mark as Read
                    </button>
                  </li>
                )}
                <li>
                  <button onClick={() => removeReading(reading.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                </li>
              </ul>
            </details>
          </VolumeCard>
        ))}
      </div>
    </div>
  );
};
export default Shelf;
