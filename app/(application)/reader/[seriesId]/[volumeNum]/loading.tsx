'use client';

<<<<<<< Updated upstream
=======
import React from 'react';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
>>>>>>> Stashed changes
import { faMaximize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import React from 'react';
import Pagination from './Pagination';
import Settings from './Settings';

export function Loading() {
<<<<<<< Updated upstream
  const { fullScreen, setFullScreen } = useGlobalContext();
=======
  const { fullScreen, setFullScreen, setAllReadings } = useGlobalContext();
>>>>>>> Stashed changes
  return (
    <div
      id="pagesContainer"
      className={`flex flex-col m-0 w-full h-full ${
        fullScreen ? 'fixed top-0' : ''
      }`}
    >
      {!fullScreen && (
        <div className="join">
          <button type="button" className="join-item btn" onClick={() => setFullScreen(true)}>
            <FontAwesomeIcon icon={faMaximize} />
          </button>
          <Pagination
            currentPage={0}
            setBoundPage={() => {}}
            pageCount={100}
            useTwoPages={false}
            firstPageIsCover={false}
          />
          <Settings
            volumeId={-1}
            useTwoPages={false}
            setUseTwoPages={() => {}}
            firstPageIsCover={false}
            setFirstPageIsCover={() => {}}
          />
        </div>
      )}
      <div
        id="visiblePagesContainer"
        className="flex justify-center w-full h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg=="
          width={1000}
          height="100%"
          alt="Loading"
        />
      </div>
    </div>
  );
}

export default Loading;
