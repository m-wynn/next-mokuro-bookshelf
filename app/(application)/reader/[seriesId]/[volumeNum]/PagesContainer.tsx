'use client';

import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

import {
  faEye, faMask, faMaximize, faMinimize,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import type { Reading } from 'lib/reading';
import PageContainer from './PageContainer';
import Pagination from './Pagination';
import Settings from './Settings';

import { useVolumeContext } from './VolumeDataProvider';
import { updateReadingProgress } from './functions';
import type { Page } from './page';

function DummyYomichanSentenceTerminator() {
  // This element is a hack to keep Yomitan at bay.
  // It adds one of the sentence termination characters to the DOM
  // but keeps it invisible so that it doesn't end up including the stuff
  // before the beginning or after the end of the page containers.
  // Chromium is smart enough to know that 'color:transparent' means that the content is not
  // visible (so it's ignored), so we have to use a color that is almost transparent instead
  return (
    <p className="dummyYomichanSentenceTerminator" style={{ position: 'absolute', color: 'rgba(255,255,255,0.01)', zIndex: '-1' }}>"</p>
  );
}

function formatPageTitle(
  volumeData: any,
  currentPage: number,
  showTwoPages: boolean,
  userSettings: any,
): string {
  const { seriesTitle, volumeNumber, seriesShortTitle } = volumeData;
  const { customTitleFormatString, useJapaneseTitle } = userSettings;
  const realCurrentPage = currentPage + 1;
  const localizedVolumeNumber = useJapaneseTitle ? `${volumeNumber}巻` : `Vol ${volumeNumber}`;

  if (!customTitleFormatString) {
    return `${seriesTitle} — ${localizedVolumeNumber} — ${realCurrentPage}${showTwoPages ? `,${realCurrentPage + 1}` : ''}`;
  }
  return customTitleFormatString
    .replace('{seriesTitle}', seriesTitle)
    .replace('{seriesShortTitle}', seriesShortTitle ?? '')
    .replace('{localizedVolumeNumber}', localizedVolumeNumber)
    .replace('{volumeNumber}', volumeNumber.toString())
    .replace('{currentPage}', `${realCurrentPage}${showTwoPages ? `,${realCurrentPage + 1}` : ''}`);
}

export default function PagesContainer({
  volumeId,
  pages,
}: {
  volumeId: number;
  pages: Page[];
}) {
  const volumeData = useVolumeContext();
  const [useTwoPages, setUseTwoPages] = useState(volumeData.useTwoPages);
  const [firstPageIsCover, setFirstPageIsCover] = useState(
    volumeData.firstPageIsCover,
  );
  const {
    currentPage, setCurrentPage, useTracking, setUseTrackingAndReturn,
  } = volumeData;

  const layoutChanged = useRef({ useTwoPages, firstPageIsCover }).current;
  const { fullScreen, setFullScreen, setAllReadings } = useGlobalContext();
  const { userSettings } = useGlobalContext();

  const showTwoPages = useMemo(
    () => useTwoPages
      && currentPage < pages.length - 1
      && (!firstPageIsCover || currentPage > 0),
    [useTwoPages, currentPage, pages, firstPageIsCover],
  );

  useEffect(() => {
    document.title = formatPageTitle(volumeData, currentPage, showTwoPages, userSettings);
  }, [
    currentPage,
    showTwoPages,
    userSettings,
    volumeData,
  ]);

  useEffect(() => {
    (async () => {
      if (!useTracking) return;
      let pageToSet = currentPage;
      if (useTwoPages && currentPage !== pages.length - 1) {
        pageToSet = currentPage + 1;
      }
      const reading = await updateReadingProgress(volumeId, pageToSet);
      if (reading) {
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
      }
    })();
  }, [currentPage, volumeId, setAllReadings, pages.length, useTwoPages, useTracking]);

  const setBoundPage = useCallback(
    (page: number) => {
      const boundPage = (pageNum: number) => {
        const boundedPage = Math.min(pages.length - 1, Math.max(0, pageNum));
        if (boundedPage === 0) return 0;
        if (useTwoPages && !firstPageIsCover && boundedPage % 2 === 1) {
          return boundedPage - 1;
        } if (useTwoPages && firstPageIsCover && boundedPage % 2 === 0) {
          return boundedPage - 1;
        }
        return boundedPage;
      };
      setCurrentPage(boundPage(page));
    },
    [pages.length, firstPageIsCover, useTwoPages, setCurrentPage],
  );

  useEffect(() => {
    if (
      layoutChanged.useTwoPages !== useTwoPages
      || layoutChanged.firstPageIsCover !== firstPageIsCover
    ) {
      layoutChanged.useTwoPages = useTwoPages;
      layoutChanged.firstPageIsCover = firstPageIsCover;
      setBoundPage(currentPage);
    }
  }, [firstPageIsCover, useTwoPages, currentPage, setBoundPage, layoutChanged]);

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // We only care about keys we specifically define
      // eslint-disable-next-line default-case
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation();
          setBoundPage(currentPage - (showTwoPages ? 2 : 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation();
          setBoundPage(currentPage + (showTwoPages ? 2 : 1));
          break;
      }
    },
    [setBoundPage, currentPage, showTwoPages],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const reZoom = () => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current;
      zoomToElement('visiblePagesContainer', undefined, 50);
    }
  };

  useEffect(() => {
    if (pages) {
      reZoom();
    }
  }, [currentPage, pages, showTwoPages, fullScreen]);

  const page = useMemo(() => pages[currentPage], [pages, currentPage]);

  const getImageUri = (id: number) => `/api/page/${id}`;

  return (
    <div
      id="pagesContainer"
      className={`flex flex-col m-0 w-full h-full ${
        fullScreen ? 'fixed top-0' : ''
      }`}
    >
      {fullScreen ? (
        <div className="flex fixed top-0 left-0 z-10 items-center rounded-lg bg-base-200">
          <button
            type="button"
            className="btn btn-square join-item"
            onClick={() => setFullScreen(false)}
          >
            <FontAwesomeIcon icon={faMinimize} />
          </button>
          <div
            className="pr-4 pl-4 join-item"
          >
            {currentPage + 1} / {pages.length}
          </div>
        </div>
      ) : (
        <div className="join">
          <button type="button" className="join-item btn" onClick={() => setFullScreen(true)}>
            <FontAwesomeIcon icon={faMaximize} />
          </button>
          <Pagination
            currentPage={currentPage}
            setBoundPage={setBoundPage}
            pageCount={pages.length}
            useTwoPages={useTwoPages}
            firstPageIsCover={firstPageIsCover}
          />
          <Settings
            volumeId={volumeId}
            useTwoPages={useTwoPages}
            setUseTwoPages={setUseTwoPages}
            firstPageIsCover={firstPageIsCover}
            setFirstPageIsCover={setFirstPageIsCover}
          />
          {useTracking ? (
            <button type="button" className="join-item btn tooltip tooltip-bottom" data-tip="Saving your reading progress" onClick={() => setUseTrackingAndReturn(!useTracking, false)}>
              <FontAwesomeIcon icon={faEye} />
            </button>
          ) : (
            <button type="button" className="join-item btn btn-warning tooltip tooltip-bottom tooltip-warning" data-tip="Not saving your reading progress. Click to go back to where you left off" onClick={() => setUseTrackingAndReturn(!useTracking, true)}>
              <FontAwesomeIcon icon={faMask} />
            </button>
          )}
        </div>
      )}
      <TransformWrapper
        limitToBounds={false}
        centerOnInit
        minScale={0.2}
        panning={{
          velocityDisabled: true,
          excluded: ['leading-none', 'group'],
        }}
        wheel={{
          smoothStep: 0.001 * volumeData.zoomSensitivity,
        }}
        zoomAnimation={{
          disabled: true,
        }}
        doubleClick={{
          disabled: true,
        }}
        alignmentAnimation={{
          disabled: true,
        }}
        ref={transformComponentRef}
      >
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          <DummyYomichanSentenceTerminator />
          <div id="visiblePagesContainer" className="flex flex-row flex-nowrap">
            {showTwoPages ? (
              <PageContainer
                page={pages[currentPage + 1]}
                preloads={[]}
                getImageUri={getImageUri}
                highlightBlock={
                volumeData?.highlightBlock?.page === currentPage + 1
                  ? volumeData.highlightBlock.block
                  : undefined
              }
              />
            ) : null}
            <PageContainer
              page={page}
              preloads={(showTwoPages ? [2, 3, 4] : [1, 2])
                .map((i) => currentPage + i)
                .filter((i) => i < pages.length)
                .map((i) => pages[i])}
              getImageUri={getImageUri}
              highlightBlock={
                volumeData?.highlightBlock?.page === currentPage
                  ? volumeData.highlightBlock.block
                  : undefined
              }
            />
          </div>
          <DummyYomichanSentenceTerminator />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
