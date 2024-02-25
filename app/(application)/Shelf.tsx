import type { Reading } from 'lib/reading';

import React from 'react';
import { ReadingStack } from './ReadingStack';

type ShelfProps = {
  title: string;
  readings: Reading[];
};

function Shelf({
  title,
  readings,
}: ShelfProps) {
  return (
    <div className="p-4 m-4 shadow-lg bg-base-200">
      <h1 className="mb-4 text-4xl font-bold text">{title}</h1>
      <div className="flex flex-wrap mb-6 section">
        {readings.map((reading) => (
          <ReadingStack reading={reading} key={reading.series.id} />
        ))}
      </div>
    </div>
  );
}
export default Shelf;
