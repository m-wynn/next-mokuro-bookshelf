'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';

import Pagination from './Pagination';
import PageContainer from './PageContainer';
import Settings from './Settings';

import type { Page } from './page';
import type { Reading } from 'lib/reading';
import { useVolumeContext } from './VolumeDataProvider';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';
import { updateReadingProgress } from './functions';

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
  const [currentPage, setCurrentPage] = useState(volumeData.currentPage);

  const layoutChanged = useRef({ useTwoPages, firstPageIsCover }).current;
  const { fullScreen, setFullScreen, setAllReadings } = useGlobalContext();

  useEffect(() => {
    (async () => {
      let pageToSet = currentPage;
      if (useTwoPages && currentPage != pages.length - 1) {
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
            } else {
              return r;
            }
          });
          if (!found) {
            edited.push(reading);
          }
          return edited;
        });
      }
    })();
  }, [currentPage, volumeId, setAllReadings, pages.length, useTwoPages]);

  const setBoundPage = useCallback(
    (page: number) => {
      const boundPage = (page: number) => {
        const boundedPage = Math.min(pages.length - 1, Math.max(0, page));
        if (boundedPage == 0) return 0;
        if (useTwoPages && !firstPageIsCover && boundedPage % 2 === 1) {
          return boundedPage - 1;
        } else if (useTwoPages && firstPageIsCover && boundedPage % 2 === 0) {
          return boundedPage - 1;
        } else {
          return boundedPage;
        }
      };
      setCurrentPage(boundPage(page));
    },
    [pages.length, firstPageIsCover, useTwoPages],
  );

  useEffect(() => {
    if (
      layoutChanged.useTwoPages !== useTwoPages ||
      layoutChanged.firstPageIsCover !== firstPageIsCover
    ) {
      layoutChanged.useTwoPages = useTwoPages;
      layoutChanged.firstPageIsCover = firstPageIsCover;
      setBoundPage(currentPage);
    }
  }, [firstPageIsCover, useTwoPages, currentPage, setBoundPage, layoutChanged]);

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const showTwoPages = useMemo(
    () =>
      useTwoPages &&
      currentPage < pages.length - 1 &&
      (!firstPageIsCover || currentPage > 0),
    [useTwoPages, currentPage, pages, firstPageIsCover],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
          <div className="fixed top-0 left-0 z-10 flex items-center bg-base-200 rounded-lg">
            <button
              className="btn btn-square join-item"
              onClick={() => setFullScreen(false)}
            >
              <FontAwesomeIcon icon={faMinimize} />
            </button>
            <div
              className="join-item pl-4 pr-4"
            >
              {currentPage + 1} / {pages.length}
            </div>
          </div>
      ) : (
        <div className="join">
          <button className="join-item btn" onClick={() => setFullScreen(true)}>
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
        </div>
      )}
      <TransformWrapper
        limitToBounds={false}
        centerOnInit={true}
        minScale={0.2}
        panning={{
          velocityDisabled: true,
          excluded: ['leading-none', 'group'],
        }}
        wheel={{
          smoothStep: 0.001 * volumeData.zoomSensitivity,
          excluded: ['leading-none', 'group'],
        }}
        zoomAnimation={{
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
          <DummyYomichanSentenceTerminator/>
          <div id="visiblePagesContainer" className="flex flex-row flex-nowrap">
            {showTwoPages ? (
              <PageContainer
                page={pages[currentPage + 1]}
                preloads={[]}
                getImageUri={getImageUri}
              />
            ) : null}
            <PageContainer
              page={page}
              preloads={(showTwoPages ? [2, 3, 4] : [1, 2])
                .map((i) => currentPage + i)
                .filter((i) => i < pages.length)
                .map((i) => pages[i])}
              getImageUri={getImageUri}
            />
          </div>
          <DummyYomichanSentenceTerminator/>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

const DummyYomichanSentenceTerminator = () => {
  // This element is a hack to keep Yomitan at bay. It adds one of the sentence termination characters
  // to the DOM but keeps it invisible so that it doesn't end up including the stuff before the beginning
  // or after the end of the page containers
  return (
    <p className='dummyYomichanSentenceTerminator' style={{position: 'absolute', color: 'transparent'}}>"</p>
  );
}
