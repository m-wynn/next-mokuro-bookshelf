'use client';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Shelf from './Shelf';

import { ReadingStatus } from '@prisma/client';
import { Reading } from 'lib/reading';
import { useGlobalContext } from './GlobalContext';

export const Bookshelf = ({
  updateReadingStatus,
  removeReading,
}: {
  updateReadingStatus: (id: number, status: ReadingStatus) => Promise<Reading>;
  removeReading: (id: number) => Promise<Reading>;
}) => {
  const { allReadings, setAllReadings } = useGlobalContext();

  const inProgress = useMemo(
    () =>
      allReadings.filter(
        (reading) => reading.status === 'READING',
      ) as unknown as Reading[],
    [allReadings],
  );
  const unread = useMemo(
    () =>
      allReadings.filter(
        (reading) => reading.status === 'UNREAD',
      ) as unknown as Reading[],
    [allReadings],
  );
  const read = useMemo(
    () =>
      allReadings.filter(
        (reading) => reading.status === 'READ',
      ) as unknown as Reading[],
    [allReadings],
  );

  const updateReadingStatusAndState = async (
    id: number,
    status: ReadingStatus,
  ) => {
    const newReading = await updateReadingStatus(id, status);
    setAllReadings((prev: Reading[]) => {
      const newReadings = prev.map((reading) =>
        reading.id === id ? newReading : reading,
      );
      return newReadings;
    });
  };

  const removeReadingAndState = async (id: number) => {
    await removeReading(id);
    setAllReadings((prev: Reading[]) => {
      return prev.filter((reading) => reading.id !== id);
    });
  };

  return (
    <div>
      {allReadings.length === 0 && (
        <div className="alert">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <span>You don't have any volumes yet.</span>
          <div>
            <Link href="/allbooks">
              <button className="btn btn-sm btn-primary">Add Some</button>
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
};
export default Bookshelf;
