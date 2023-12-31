import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useMemo } from 'react';

function EnterInput({
  className,
  defaultValue,
  doublePage,
  onSubmit,
}: {
  className: string;
  defaultValue: number;
  doublePage: number | null;
  onSubmit: (value: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <>
      <input
        type="number"
        pattern="[0-9]*"
        className={`${className} ${doublePage ? 'h-1/2' : 'h-full'}`}
        placeholder="pg"
        value={value}
        onFocus={(_) => setValue(value)}
        onChange={(e) => {
          setValue(e.target.validity.valid ? parseInt(e.target.value, 10) : value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit(value);
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }
        }}
      />
      {doublePage && (
        <div className="p-0 m-0 w-full h-1/2 text-center text-top">
          {value + 1}
        </div>
      )}
    </>
  );
}

export default function Pagination({
  currentPage,
  setBoundPage,
  pageCount,
  useTwoPages,
  firstPageIsCover,
}: {
  currentPage: number;
  setBoundPage: (page: number) => void;
  pageCount: number;
  useTwoPages: boolean;
  firstPageIsCover: boolean;
}) {
  const oneIndexedPage = useMemo(() => currentPage + 1, [currentPage]);

  return (
    <>
      <button
        type="button"
        className="join-item btn"
        disabled={currentPage === 0}
        onClick={() => setBoundPage(currentPage - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {currentPage !== 0 && (
        <>
          <button
            type="button"
            className="join-item btn btn-square"
            onClick={() => setBoundPage(0)}
          >
            1
            {useTwoPages && !firstPageIsCover && (
              <>
                <br />
                {' '}
                2
              </>
            )}
          </button>
          {currentPage > 3 && (
            <button
              type="button"
              className="pointer-events-none join-item btn btn-square"
            >
              &#x2026;
            </button>
          )}
          {currentPage === 3 && (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(1)}
            >
              2
              {useTwoPages && firstPageIsCover && (
                <>
                  <br />
                  3
                </>
              )}
            </button>
          )}
          {currentPage > 1 && !useTwoPages && (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage - 1)}
            >
              {oneIndexedPage - 1}
            </button>
          )}
          {currentPage > 3 && useTwoPages && (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage - 2)}
            >
              {oneIndexedPage - 2}
              <br />
              {oneIndexedPage - 1}
            </button>
          )}
        </>
      )}
      <div className={currentPage < 98 ? 'w-12' : 'w-16'}>
        <EnterInput
          className="input join-item m-0 w-full p-0 text-middle text-center focus:outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          defaultValue={oneIndexedPage}
          doublePage={
            useTwoPages
            && !(firstPageIsCover && currentPage === 0)
            && currentPage !== pageCount - 1
              ? oneIndexedPage + 1
              : null
          }
          onSubmit={(value: number) => {
            setBoundPage(value - 1);
          }}
        />
      </div>
      {currentPage <= pageCount - 1 && (
        <>
          {currentPage < pageCount - 2 && !useTwoPages && (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage + 1)}
            >
              {oneIndexedPage + 1}
            </button>
          )}
          {currentPage < pageCount - 4 && useTwoPages && (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage + 2)}
            >
              {oneIndexedPage + 2}
              <br />
              {oneIndexedPage + 3}
            </button>
          )}
          {currentPage === pageCount - 4 && !useTwoPages && (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(pageCount - 2)}
            >
              {pageCount - 1}
            </button>
          )}
          {currentPage < pageCount - 5 && (
            <button
              type="button"
              className="pointer-events-none join-item btn btn-square"
            >
              &#x2026;
            </button>
          )}
          {currentPage < pageCount - 2
          || (!useTwoPages && currentPage < pageCount - 1) ? (
            <button
              type="button"
              className="join-item btn btn-square"
              onClick={() => setBoundPage(pageCount - 1)}
            >
              {useTwoPages && !(firstPageIsCover && pageCount % 2 === 0) ? (
                <>
                  {pageCount - 1}
                  {' '}
                  <br />
                </>
              ) : null}
              {pageCount}
            </button>
            ) : null}
        </>
      )}
      <button
        type="button"
        className="join-item btn"
        disabled={
          currentPage === pageCount - 1
          || (useTwoPages && currentPage === pageCount - 2)
        }
        onClick={() => setBoundPage(currentPage + (useTwoPages ? 2 : 1))}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </>
  );
}
