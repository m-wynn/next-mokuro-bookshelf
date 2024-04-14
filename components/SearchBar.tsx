'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { SearchResult } from 'search';

export function SearchBar() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchIsExhausted, setSearchIsExhausted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [
    searchTimeoutId, setSearchTimeoutId,
  ] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [searchAbortController, setSearchAbortController] = useState<AbortController | null>(null);

  const onScroll = (event: any) => {
    // visible height + pixel scrolled >= total height
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if (searchIsExhausted || isLoading) {
        return;
      }
      setOffset((prevOffset) => prevOffset + 20);
    }
  };

  useEffect(() => {
    setSearchResults([]);
    setOffset(0);
    setSearchIsExhausted(false);
  }, [search]);

  useEffect(() => {
    (async () => {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }

      setIsLoading(true);
      const newTimeoutId = setTimeout(async () => {
        if (searchAbortController && !searchAbortController.signal.aborted) {
          searchAbortController.abort();
        }
        const newAbortController = new AbortController();
        setSearchAbortController(newAbortController);
        await fetch(`/api/search?q=${search}&offset=${offset}`, { signal: newAbortController.signal })
          .then(async (results) => {
            setSearchAbortController(null);
            const newResults = await results.json() as SearchResult[];
            if (newResults.length === 0) {
              setSearchIsExhausted(true);
              return;
            }
            setSearchResults((originalSearchResults) => [...originalSearchResults, ...newResults]);
          })
          .catch(() => {})
          .finally(() => { setIsLoading(false); });
      }, 300);
      setSearchTimeoutId(newTimeoutId);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, offset]);

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
      <div className="overflow-auto top-14 z-50 flex-col max-h-96 rounded-md w-[24rem] dropdown-content bg-base-300" onScroll={onScroll}>
        <ul
          className="menu menu-compact"
          // use ref to calculate the width of parent
          style={{ width: ref.current?.clientWidth }}
        >
          {searchResults.map((item, index) => (
            <li
              key={`${item.id}-${item.blockNumber}`}
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
          {isLoading && (
            <li className="w-full">
              <div className="flex flex-col">
                <p className="center">Loading...</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
