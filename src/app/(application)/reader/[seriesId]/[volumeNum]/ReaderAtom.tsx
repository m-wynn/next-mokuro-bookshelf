import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { useHydrateAtoms } from 'jotai/utils';

import { useGlobalContext } from 'app/(application)/GlobalContext';
import { useSearchParams } from 'next/navigation';
import type { Volume } from './page';

export type HighlightBlock = { page: number, block: number } | null;

const initialPageAtom = atom(0);
const useTrackingAtom = atom(true);
const firstPageIsCoverAtom = atom(false);
const useTwoPagesAtom = atom(false);
const zoomSensitivityAtom = atom(1);
const seriesTitleAtom = atom('');
const shortSeriesTitleAtom = atom('');
const seriesIdAtom = atom(0);
const volumeNumberAtom = atom(0);
const highlightBlockAtom = atom<HighlightBlock>(null);

export function HydrateVolumeAtoms({
  volume,
  children,
} : {
  volume: Volume;
  children: React.ReactNode;
}) : React.ReactNode {
  const { userSettings } = useGlobalContext();
  const searchParamPage = useSearchParams().get('page');
  const searchParamBlock = useSearchParams().get('block');
  const initialPageNum = searchParamPage !== null
    ? parseInt(searchParamPage, 10) - 1
    : volume.readings[0]?.page ?? 0;
    // Todo: Add logic for useTwoPages and firstPageIsCover
  //
  const initialHighlightBlock: HighlightBlock = searchParamBlock
    ? { page: initialPageNum, block: parseInt(searchParamBlock, 10) }
    : null;

  const useJapaneseTitle = userSettings?.useJapaneseTitle ?? false;
  const { japaneseName, englishName } = volume.series;
  useHydrateAtoms([
    [initialPageAtom, initialPageNum],
    [useTrackingAtom, (searchParamPage === null && !!volume.readings.length)],
    [firstPageIsCoverAtom, volume.readings[0]?.firstPageIsCoverOverride ?? volume.firstPageIsCover],
    [useTwoPagesAtom, volume.readings[0]?.useTwoPagesOverride ?? !!userSettings?.useTwoPages],
    [zoomSensitivityAtom, userSettings?.zoomSensitivity ?? 1], // Better as a derived atom?
    [seriesTitleAtom, useJapaneseTitle && japaneseName ? japaneseName : englishName], // derive?
    [shortSeriesTitleAtom, volume.series.shortName],
    [seriesIdAtom, volume.series.id],
    [volumeNumberAtom, volume.number],
    [highlightBlockAtom, initialHighlightBlock],
  ]);
  return children;
}

const localizedVolumeNumberAtom = atom((get) => {
  const volumeNumber = get(volumeNumberAtom);
  const useJapaneseTitle = useGlobalContext().userSettings?.useJapaneseTitle ?? false;
  return useJapaneseTitle ? `${volumeNumber}巻` : `Vol ${volumeNumber}`;
});

atomEffect((get, set) => {
  const { userSettings } = useGlobalContext();
  const { customTitleFormatString, useJapaneseTitle } = userSettings;

  const formatString = customTitleFormatString ?? '{seriesTitle} {localizedVolumeNumber} {currentPage}';

  document.title = formatString
    .replace('{seriesTitle}', get(seriesTitleAtom))
    .replace('{seriesShortTitle}', get(shortSeriesTitleAtom) ?? '')
    .replace('{localizedVolumeNumber}', get(localizedVolumeNumberAtom))
    .replace('{volumeNumber}', get(volumeNumberAtom).toString())
    .replace('{currentPage}', `${get(realCurrentPageAtom)}${showTwoPages ? `,${realCurrentPage + 1}` : ''}`);
});
