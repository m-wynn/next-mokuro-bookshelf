'use client';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useMemo, useCallback } from 'react';
import { ReadingStatus } from '@prisma/client';
import type { Reading } from 'lib/reading';
import Shelf from './Shelf';

import { useGlobalContext } from './GlobalContext';
import { updateReadingStatus, removeReading } from './functions';

function compareReadings(a: Reading, b: Reading) {
  return a.volume.series.englishName.localeCompare(b.volume.series.englishName)
  || a.volume.number - b.volume.number;
}

function Bookshelf() {
  const { allReadings, setAllReadings, userSettings } = useGlobalContext();

  const canUserSeeIfNsfw = useCallback((reading: Reading) => {
    if (reading.volume.series.isNsfw && !userSettings.showNsfwContent) {
      return false;
    }
    return true;
  }, [userSettings]);

  const inProgress = useMemo(
    () => allReadings.filter(
      (reading) => reading.status === 'READING' && canUserSeeIfNsfw(reading),
    ).sort(compareReadings) as unknown as Reading[],
    [allReadings, canUserSeeIfNsfw],
  );
  const unread = useMemo(
    () => allReadings.filter(
      (reading) => reading.status === 'UNREAD' && canUserSeeIfNsfw(reading),
    ).sort(compareReadings) as unknown as Reading[],
    [allReadings, canUserSeeIfNsfw],
  );
  const read = useMemo(
    () => allReadings.filter(
      (reading) => reading.status === 'READ' && canUserSeeIfNsfw(reading),
    ).sort(compareReadings) as unknown as Reading[],
    [allReadings, canUserSeeIfNsfw],
  );

  const updateReadingStatusAndState = async (
    id: number,
    status: ReadingStatus,
  ) => {
    const newReading = await updateReadingStatus(id, status);
    setAllReadings((prev: Reading[]) => {
      const newReadings = prev.map((reading) => (reading.id === id ? newReading : reading));
      return newReadings;
    });
  };

  const removeReadingAndState = async (id: number) => {
    await removeReading(id);
    setAllReadings((prev: Reading[]) => prev.filter((reading) => reading.id !== id));
  };

  return (
    <div>
      {allReadings.length === 0 && (
        <div className="alert">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <span>You don't have any volumes yet.</span>
          <div>
            <Link href="/allbooks">
              <button type="button" className="btn btn-sm btn-primary">Add Some</button>
            </Link>
          </div>
        </div>
      )}
      {inProgress.length > 0 && (
        <Shelf
          title="Reading"
          readings={inProgress}
          updateReadingStatus={updateReadingStatusAndState}
          removeReading={removeReadingAndState}
        />
      )}
      {unread.length > 0 && (
        <Shelf
          title="Future"
          readings={unread}
          updateReadingStatus={updateReadingStatusAndState}
          removeReading={removeReadingAndState}
        />
      )}
      {read.length > 0 && (
        <Shelf
          title="Finished"
          readings={read}
          updateReadingStatus={updateReadingStatusAndState}
          removeReading={removeReadingAndState}
        />
      )}
    </div>
  );
}
export default Bookshelf;
