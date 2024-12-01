'use client';

import { useState } from 'react';
import { ReactReader } from 'react-reader';
import type { Reading } from 'lib/reading';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import type { Volume } from './page';
import { updateEpubReadingProgress } from './functions';

export default function EPubContainer({ volume }: { volume: Volume }) {
  const [location, setLocation] = useState<string | number>(volume.readings[0]?.epubPage || 0);
  const { setAllReadings } = useGlobalContext();

  const realSetLocation = async (epubcfi: string) => {
    setLocation(epubcfi);
    const reading = await updateEpubReadingProgress(volume.id, epubcfi);
    setAllReadings((prev: Reading[]) => {
      let found = false;
      const edited = prev.map((r) => {
        if (r.id === reading.id) {
          found = true;
          return reading;
        }
        return r;
      });
      if (!found) {
        edited.push(reading);
      }
      return edited;
    });
  };

  return (
    <ReactReader
      url={`/api/epub/${volume.id}.epub`}
      location={location}
      locationChanged={(epubcfi: string) => realSetLocation(epubcfi)}
    />
  );
}
