'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { SearchResult } from 'search';

export function SearchBar() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const [
    searchTimeoutId, setSearchTimeoutId,
  ] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [searchAbortController, setSearchAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    (async () => {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }

      const newTimeoutId = setTimeout(async () => {
        if (searchAbortController && !searchAbortController.signal.aborted) {
          searchAbortController.abort();
        }
        const newAbortController = new AbortController();
        setSearchAbortController(newAbortController);
        await fetch(`/api/search?q=${search}`, { signal: newAbortController.signal })
          .then(async (results) => {
            setSearchAbortController(null);
            setSearchResults(await results.json() as SearchResult[]);
          })
          .catch(() => {});
      }, 300);
      setSearchTimeoutId(newTimeoutId);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="w-full dropdown dropdown-end" id="search">
      <input
        type="text"
        placeholder="Search.."
        value={search}
        className="w-24 md:w-auto input input-bordered"
        tabIndex={0}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setSearch('');
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement?.blur();
            }
          }
        }}
      />
      <div className="overflow-auto top-14 z-50 flex-col max-h-96 rounded-md w-[24rem] dropdown-content bg-base-300">
        <ul
          className="menu menu-compact"
          // use ref to calculate the width of parent
          style={{ width: ref.current?.clientWidth }}
        >
          {searchResults.map((item, index) => (
            <li
              key={`${item.seriesId}-${item.volumeNumber}-${item.number}-${item.text}`}
              tabIndex={index + 1}
              className="w-full border-b border-b-base-content/10"
            >
              <Link
                className="flex flex-col"
                href={`/reader/${item.seriesId}/${item.volumeNumber}?page=${item.number + 1}&block=${item.blockNumber}`}
                onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement?.blur();
                  }
                }}
              >
                <div className="flex flex-row justify-between w-full">
                  <p className="text-xl text-left">{item.englishName}</p>
                  <p className="text-lg text-right">
                    {' '}
                    Vol
                    {' '}
                    {item.volumeNumber}
                    {' '}
                    pg.
                    {' '}
                    {item.number + 1}
                  </p>
                </div>
                <p>{item.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
