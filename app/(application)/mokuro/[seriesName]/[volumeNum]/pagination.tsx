import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useMemo } from "react";

export default function Pagination({
  currentPage,
  setBoundPage,
  pageCount,
  useTwoPages,
  firstPageIsCover,
}) {
  const oneIndexedPage = useMemo(() => currentPage + 1, [currentPage]);

  return (
    <>
      <button
        className="join-item btn"
        disabled={currentPage === 0}
        onClick={() => setBoundPage(currentPage - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {currentPage !== 0 && (
        <>
          <button
            className="join-item btn btn-square"
            onClick={() => setBoundPage(0)}
          >
            1
            {useTwoPages && !firstPageIsCover && (
              <>
                <br /> 2
              </>
            )}
          </button>
          {currentPage > 3 && (
            <button className="pointer-events-none join-item btn btn-square">
              &#x2026;
            </button>
          )}
          {currentPage == 3 && (
            <button
              className="join-item btn btn-square"
              onClick={() => setBoundPage(1)}
            >
              2
              {useTwoPages && firstPageIsCover && (
                <>
                  <br />3
                </>
              )}
            </button>
          )}
          {currentPage > 1 && !useTwoPages && (
            <button
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage - 1)}
            >
              {oneIndexedPage - 1}
            </button>
          )}
          {currentPage > 3 && useTwoPages && (
            <button
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
      <div className={currentPage < 98 ? "w-12" : "w-16"}>
        <EnterInput
          className="input join-item m-0 w-full p-0 text-middle text-center focus:outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          defaultValue={oneIndexedPage}
          doublePage={
            useTwoPages &&
            !(firstPageIsCover && currentPage == 0) &&
            currentPage != pageCount - 1
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
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage + 1)}
            >
              {oneIndexedPage + 1}
            </button>
          )}
          {currentPage < pageCount - 4 && useTwoPages && (
            <button
              className="join-item btn btn-square"
              onClick={() => setBoundPage(currentPage + 2)}
            >
              {oneIndexedPage + 2}
              <br />
              {oneIndexedPage + 3}
            </button>
          )}
          {currentPage == pageCount - 4 && !useTwoPages && (
            <button
              className="join-item btn btn-square"
              onClick={() => setBoundPage(pageCount - 2)}
            >
              {pageCount - 1}
            </button>
          )}
          {currentPage < pageCount - 5 && (
            <button className="pointer-events-none join-item btn btn-square">
              &#x2026;
            </button>
          )}
          {currentPage < pageCount - 2 ||
          (!useTwoPages && currentPage < pageCount - 1) ? (
            <button
              className="join-item btn btn-square"
              onClick={() => setBoundPage(pageCount - 1)}
            >
              {useTwoPages && !(firstPageIsCover && pageCount % 2 == 0) ? (
                <>
                  {pageCount - 1} <br />
                </>
              ) : null}
              {pageCount}
            </button>
          ) : null}
        </>
      )}
      <button
        className="join-item btn"
        disabled={
          currentPage === pageCount - 1 ||
          (useTwoPages && currentPage === pageCount - 2)
        }
        onClick={() => setBoundPage(currentPage + (useTwoPages ? 2 : 1))}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </>
  );
}

const EnterInput = ({ className, defaultValue, doublePage, onSubmit }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <>
      <input
        type="text"
        pattern="[0-9]*"
        className={`${className} ${doublePage ? "h-1/2" : "h-full"}`}
        placeholder="pg"
        value={value}
        onFocus={(e) => setValue(parseInt(value))}
        onChange={(e) => {
          setValue(e.target.validity.valid ? e.target.value : value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(value);
            document.activeElement?.blur();
          }
        }}
      />
      {doublePage && (
        <div className="p-0 m-0 w-full h-1/2 text-center text-top">
          {parseInt(value) + 1}
        </div>
      )}
    </>
  );
};
