export type VolumeData = {
  number: number;
  coverPage: File;
  pages: PageData[];
  firstPageIsCover: boolean;
  seriesId: number;
};

export type PageData = {
  page: File;
  ocr: File;
  index: number;
};

export type PageUploadData = {
  pagesToUpload: PageData[];
  uploadsSoFar: number;
};

export type FormChild = {
  errors: FieldErrors<VolumeFields>;
  register: UseFormRegister<VolumeFields>;
  watch: UseFormWatch<VolumeFields>;
};

export type VolumeFields = {
  seriesEnglishName: string;
  volumeNumber: number;
  coverImage: FileList;
  firstPageIsCover: boolean;
  pages: FileList;
  ocrFiles: FileList;
};
