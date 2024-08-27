/* eslint-disable react/no-array-index-key */
import React from 'react';

<<<<<<< Updated upstream
export const Loading = () => Array.from({ length: 3 }).map((_i, i) => (
=======
export const Loading = () => Array.from({ length: 3 }).map((_, i) => (
>>>>>>> Stashed changes
  <div key={i} className="p-4 m-4 shadow-lg bg-base-200">
    <div className="mb-4 w-40 h-12 skeleton" />
    <div className="flex flex-wrap mb-6 section">
      {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
<<<<<<< Updated upstream
        (_j, j) => (
          <div
            key={j}
=======
        (_, i) => (
          <div
            key={i}
>>>>>>> Stashed changes
            className="flex-initial m-2 shadow hover:shadow-lg w-[13.5rem] h-[20.25rem] readingcard card card-compact image-full bg-base-300"
          >
            <figure className="overflow-hidden">
              <div className="w-[13.5rem] h-[20.25rem] skeleton" />
            </figure>
          </div>
        ),
      )}
    </div>
  </div>
));
export default Loading;
