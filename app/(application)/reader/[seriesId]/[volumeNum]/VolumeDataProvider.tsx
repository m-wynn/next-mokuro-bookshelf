'use client';

import { useGlobalContext } from 'app/(application)/GlobalContext';
import { UserSettingsDefaultValues } from 'lib/userSetting';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext, useContext, useEffect, useState,
} from 'react';
import type { Volume } from './page';

const { useTwoPages, zoomSensitivity } = UserSettingsDefaultValues;

export type HighlightBlock = { page: number, block: number } | null;

const VolumeContext = createContext({
  currentPage: 0,
  setCurrentPage: (_page: number) => {},
  useTracking: true,
  setUseTrackingAndReturn: (_useTracking: boolean, _returnToReadingPage: boolean) => {},
  firstPageIsCover: false,
  useTwoPages,
  zoomSensitivity,
  seriesTitle: '',
  volumeNumber: 0,
  highlightBlock: null as HighlightBlock,
});

export function useVolumeContext() {
  return useContext(VolumeContext);
}

export default function VolumeDataProvider({
  children,
  volume,
}: {
  children: React.ReactNode;
  volume: Volume;
}) {
  const { userSettings } = useGlobalContext();

  const getZoomSensitivity = () => userSettings?.zoomSensitivity ?? 1;

  const getUseTwoPages = () => {
    const defaultSetting = !!userSettings?.useTwoPages;
    const override = volume.readings[0]?.useTwoPagesOverride ?? null;
    if (override === null) {
      return defaultSetting;
    }
    return override;
  };

  const getFirstPageIsCover = () => {
    const defaultSetting = volume.firstPageIsCover;
    const override = volume.readings[0]?.firstPageIsCoverOverride ?? null;
    if (override === null) {
      return defaultSetting;
    }
    return override;
  };

  const initialPageValue = useSearchParams().get('page');
  const initialPageNum = initialPageValue !== null ? parseInt(initialPageValue, 10) : null;
  const blockValue = useSearchParams().get('block');
  const initialHighlightBlock = blockValue !== null ? parseInt(blockValue, 10) : null;

  const getCurrentPage = () => {
    const page = initialPageNum !== null ? initialPageNum - 1 : (volume.readings[0]?.page ?? 0);
    if (page > 0 && getUseTwoPages()) {
      if (getFirstPageIsCover() && page % 2 === 0) {
        return page - 1;
      } if (!getFirstPageIsCover() && page % 2 === 1) {
        return page - 1;
      }
    }
    return page;
  };

  const useJapaneseTitle = userSettings?.useJapaneseTitle ?? false;
  const { japaneseName, englishName } = volume.series;
  const seriesTitle = useJapaneseTitle && japaneseName ? japaneseName : englishName;

  const router = useRouter();
  const { volumeNum, seriesId } = useParams();

  const [currentPage, setCurrentPage] = useState(getCurrentPage());
  const [highlightBlock, setHighlightBlock] = useState<HighlightBlock>(
    initialHighlightBlock !== null ? {
      page: getCurrentPage(), block: initialHighlightBlock,
    } : null,
  );
  const [useTracking, setUseTracking] = useState(initialPageNum === null);

  const setUseTrackingAndReturn = (value: boolean, returnToReadingPage: boolean) => {
    if (returnToReadingPage) {
      setCurrentPage(getCurrentPage());
    }
    setUseTracking(value);
  };

  useEffect(() => {
    if (initialHighlightBlock !== null) {
      setHighlightBlock({
        page: initialPageNum ? initialPageNum - 1 : getCurrentPage(),
        block: initialHighlightBlock,
      });
    }
    if (initialPageNum) {
      setCurrentPage(getCurrentPage());
      setUseTracking(false);
    }
    if (initialPageNum || highlightBlock !== null) {
      router.replace(`/reader/${seriesId}/${volumeNum}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPageNum, initialHighlightBlock]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    currentPage,
    setCurrentPage: (page: number) => { setHighlightBlock(null); setCurrentPage(page); },
    useTwoPages: getUseTwoPages(),
    firstPageIsCover: getFirstPageIsCover(),
    zoomSensitivity: getZoomSensitivity(),
    seriesTitle,
    volumeNumber: volume.number,
    useTracking,
    setUseTrackingAndReturn,
    highlightBlock,
  };

  return (
    <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
  );
}
