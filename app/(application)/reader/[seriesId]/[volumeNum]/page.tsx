"use client";
import RedirectHandler from "./redirecthandler";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import Pagination from "./Pagination";
import PageContainer from "./PageContainer";
import Settings from "./Settings";

type Page = {
  fileName: string;
  ocr: OcrContents;
  number: number;
};

type OcrContents = {
  version: string;
  img_width: number;
  img_height: number;
  blocks: OcrBlock[];
};

type OcrBlock = {
  box: number[];
  vertical: boolean;
  font_size: number;
  lines_coords: number[][];
  lines: string[];
};

export default function Page({
  params: { seriesId, volumeNum },
}: {
  params: { seriesId: string; volumeNum: string };
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const [volumeId, setVolumeId] = useState(null);
  const [useTwoPages, setUseTwoPages] = useState(false);
  const [firstPageIsCover, setFirstPageIsCover] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const getVolume = async () => {
      const res = await fetch(
        `/api/volume?series=${seriesId}&volume=${volumeNum}`,
      );
      const data = await res.json();
      setVolumeId(data.id);
    };

    if (seriesId && volumeNum) {
      getVolume();
    }
  }, [seriesId, volumeNum]);

  const layoutChanged = useRef({ useTwoPages, firstPageIsCover }).current;

  useEffect(() => {
    if (currentPage > 0 && volumeId != null) {
      fetch(`/api/readingProgress/${volumeId}`, {
        method: "POST",
        body: JSON.stringify({ page: currentPage }),
      });
    }
  }, [currentPage, volumeId]);

  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem('settings') || '{}');
    setUseTwoPages(!!settings?.[volumeId]?.useTwoPages);
    setFirstPageIsCover(!!settings?.[volumeId]?.firstPageIsCover);
  }, [volumeId]);

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
    const getReading = async () => {
      const res = await fetch(`/api/readingProgress/${volumeId}`);
      const data = await res.json();
      const { page } = data;
      setCurrentPage(page);
    };
    if (volumeId != null && currentPage == 0) getReading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentPage, volumeId]);

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

  useEffect(() => {
    const getPages = async () => {
      const res = await fetch(
        `/api/page?series=${seriesId}&volume=${volumeNum}`,
      );
      const data = await res.json();
      setPages(data);
    };

    if (seriesId && volumeNum) {
      getPages();
    }
  }, [seriesId, volumeNum]);

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const showTwoPages = useMemo(
    () =>
      useTwoPages &&
      currentPage < pages.length - 2 &&
      (!firstPageIsCover || currentPage > 0),
    [useTwoPages, currentPage, pages, firstPageIsCover],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          e.stopPropagation();
          setBoundPage(currentPage - (showTwoPages ? 2 : 1));
          break;
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          setBoundPage(currentPage + (showTwoPages ? 2 : 1));
          break;
      }
    },
    [setBoundPage, currentPage, showTwoPages],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (transformComponentRef.current && pages) {
      const { zoomToElement } = transformComponentRef.current;
      zoomToElement("visiblePagesContainer", undefined, 50);
    }
  }, [currentPage, pages, showTwoPages]);

  const page = useMemo(() => pages[currentPage], [pages, currentPage]);

  const getImageUri = useCallback(
    (filename: string) => `/images/${volumeId}/${filename}`,
    [volumeId],
  );

  return (
    <div id="pagesContainer" className="flex fixed flex-col m-0 w-full h-full">
      <div className="join">
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
      <TransformWrapper
        limitToBounds={false}
        centerOnInit={true}
        minScale={0.2}
        panning={{
          velocityDisabled: true,
          excluded: ["leading-none", "group"],
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
            width: "100%",
            height: "100%",
          }}
        >
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
              preloads={[]}
              getImageUri={getImageUri}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
