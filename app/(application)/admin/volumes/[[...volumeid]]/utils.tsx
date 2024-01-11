import { VolumeData } from './types';

type RawVolumeData = {
  number: number;
  pageFiles: File[];
  ocrFiles: File[];
  coverFile: File | null;
  firstPageIsCover: boolean;
  seriesId: number;
};

const getVolumeNumberFromFilePath: string | null = (name: string) => {
  const regex = /Volume (\d+)/;
  const match = name.match(regex)
  if (match) {
      return parseInt(match[1]);
  }
  return null;
};

const isCoverFile: boolean = (name: string) => {
  const parts = name.split('.');
  return parts.length === 2 && parts[0] === 'cover';
};

const isPageFile: boolean = (path: string) => {
  const parts = path.split('/');
  if (parts.length >= 2) {
      const volumePart = parts[parts.length - 2];
      return /^Volume \d+$/.test(volumePart);
  }
  return false;
};

const isOcrFile: boolean = (path: string) => {
  const parts = path.split('/');
  if (parts.length >= 3) {
      const volumePart = parts[parts.length - 2];
      const ocrPart = parts[parts.length - 3];
      return /^Volume \d+$/.test(volumePart) && /^_ocr$/.test(ocrPart);
  }
  return false;
};

export const getVolumeData: VolumeData[] = (seriesId, files: FileList) => {
  const volumeDatas = {};
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
        seriesId: seriesId,
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

  for (const volumeNum in volumeDatas) {
    volumeDatas[volumeNum].pageFiles.sort((a, b) => a.name.localeCompare(b.name));
  }

  const volumes = Object.keys(volumeDatas).map(function(key) {
    return volumeDatas[key];
  });
  volumes.sort((a, b) => a.number - b.number);

  return volumes.map(rawVolumeDataToVolumeData);
};

const rawVolumeDataToVolumeData: VolumeData = (rawData: RawVolumeData) => {
  let volumeData = {
    number: rawData.number,
    coverPage: rawData.coverFile,
    firstPageIsCover: rawData.firstPageIsCover,
    seriesId: rawData.seriesId,
    pages: [],
  };

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
}

export const getOcrFileForPage: File = (page: File, ocrFiles: Array) => {
  return ocrFiles.find(
    (ocrFile) => ocrFile.name === `${page.name.replace(/\.[^/.]+$/, '')}.json`,
  ) as File;
};
