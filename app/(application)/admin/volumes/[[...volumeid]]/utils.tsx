import { VolumeData, PageData } from './types';

type RawVolumeData = {
  number: number;
  pageFiles: File[];
  ocrFiles: File[];
  coverFile: File | null;
  firstPageIsCover: boolean;
  seriesId: number;
};

interface VolumeDataMap {
  [key: number]: RawVolumeData;
}

const getVolumeNumberFromFilePath = (name: string): number | null => {
  const regex = /Volume (\d+)/;
  const match = name.match(regex);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

const isCoverFile = (name: string): boolean => {
  const parts = name.split('.');
  return parts.length === 2 && parts[0] === 'cover';
};

const isPageFile = (path: string): boolean => {
  const parts = path.split('/');
  if (parts.length >= 2) {
    const volumePart = parts[parts.length - 2];
    return /^Volume \d+$/.test(volumePart);
  }
  return false;
};

const isOcrFile = (path: string): boolean => {
  const parts = path.split('/');
  if (parts.length >= 3) {
    const volumePart = parts[parts.length - 2];
    const ocrPart = parts[parts.length - 3];
    return /^Volume \d+$/.test(volumePart) && /^_ocr$/.test(ocrPart);
  }
  return false;
};

export const getOcrFileForPage = (page: File, ocrFiles: File[]): File => ocrFiles.find(
  (ocrFile) => ocrFile.name === `${page.name.replace(/\.[^/.]+$/, '')}.json`,
) as File;

const rawVolumeDataToVolumeData = (rawData: RawVolumeData): VolumeData => {
  const volumeData = {
    number: rawData.number,
    coverPage: rawData.coverFile,
    firstPageIsCover: rawData.firstPageIsCover,
    seriesId: rawData.seriesId,
    pages: [],
  } as VolumeData;

  rawData.pageFiles.forEach((pageFile, index) => {
    const ocrFile = getOcrFileForPage(pageFile, rawData.ocrFiles);
    const pageData = {
      page: pageFile,
      ocr: ocrFile,
      index,
    } as PageData;
    volumeData.pages.push(pageData);
  });

  return volumeData;
};

export const getVolumeData = (seriesId: number, files: FileList): VolumeData[] => {
  const volumeDatas: VolumeDataMap = {};
  Array.from(files).forEach((file) => {
    const filePath = file.webkitRelativePath;
    const fileName = file.name;
    const volumeNum = getVolumeNumberFromFilePath(filePath);
    if (volumeNum === null) {
      return;
    }

    if (!(volumeNum in volumeDatas)) {
      volumeDatas[volumeNum] = {
        number: volumeNum,
        pageFiles: [],
        ocrFiles: [],
        coverFile: null,
        firstPageIsCover: false,
        seriesId,
      } as RawVolumeData;
    }

    if (isOcrFile(filePath)) {
      volumeDatas[volumeNum].ocrFiles.push(file);
    } else if (isCoverFile(fileName)) {
      volumeDatas[volumeNum].coverFile = file;
    } else if (isPageFile(filePath)) {
      volumeDatas[volumeNum].pageFiles.push(file);
    }
  });

  Object.keys(volumeDatas).forEach((volumeNum) => {
    const numericKey = parseInt(volumeNum, 10);
    volumeDatas[numericKey].pageFiles.sort((a, b) => a.name.localeCompare(b.name));
  });

  const volumes = Object.keys(volumeDatas).map((key) => {
    const numericKey = parseInt(key, 10);
    return volumeDatas[numericKey];
  });
  volumes.sort((a, b) => a.number - b.number);

  return volumes.map(rawVolumeDataToVolumeData);
};
