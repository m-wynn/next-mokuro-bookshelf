'use client';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useMemo, useCallback } from 'react';
import type { Reading } from 'lib/reading';
import Shelf from './Shelf';

import { useGlobalContext } from './GlobalContext';

function Bookshelf() {
  const { allReadings, userSettings } = useGlobalContext();

  const canUserSeeIfNsfw = useCallback((reading: Reading) => {
    if (reading.series.isNsfw && !userSettings.showNsfwContent) {
      return false;
    }
    return true;
  }, [userSettings]);

  const inProgress = useMemo(
    () => allReadings.filter(
      (reading) => reading.status === 'READING' && canUserSeeIfNsfw(reading),
    ) as unknown as Reading[],
    [allReadings, canUserSeeIfNsfw],
  );
  const unread = useMemo(
    () => allReadings.filter(
      (reading) => reading.status === 'UNREAD' && canUserSeeIfNsfw(reading),
    ) as unknown as Reading[],
    [allReadings, canUserSeeIfNsfw],
  );
  const read = useMemo(
    () => allReadings.filter(
      (reading) => reading.status === 'READ' && canUserSeeIfNsfw(reading),
    ) as unknown as Reading[],
    [allReadings, canUserSeeIfNsfw],
  );

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
        />
      )}
      {unread.length > 0 && (
        <Shelf
          title="Future"
          readings={unread}
        />
      )}
      {read.length > 0 && (
        <Shelf
          title="Finished"
          readings={read}
        />
      )}
    </div>
  );
}
export default Bookshelf;
