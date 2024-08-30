/* eslint-disable react/no-array-index-key */
import React from 'react';

export const Loading = () => Array.from({ length: 3 }).map((_i, i) => (
  <div key={i} className="mb-4 w-full">
    <div className="flex-initial p-4 w-full shadow-md bg-base-200">
      <div className="mb-2 w-36 h-10 skeleton" />
      <div className="flex flex-wrap mb-4 w-full">
        {Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(
          (_j, j) => (
            <div
              key={j}
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
  </div>
));
export default Loading;
