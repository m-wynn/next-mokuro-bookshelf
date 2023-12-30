declare module "volume" {
  export interface OcrPage {
    version: string;
    img_width: number;
    img_height: number;
    blocks: OcrBlock[];
  }

  export interface OcrBlock {
    box: number[];
    vertical: boolean;
    font_size: number;
    lines_coords: number[][][];
    lines: string[];
  }

  export type Reading = {
    id: number;
    page: number;
    status: ReadingStatus;
    updatedAt: Date;
    volume: {
      number: number;
      id: number;
      seriesId: number;
      cover: string;
      _count: {
        pages: number;
      };
      series: {
        name: string;
        id: number;
      };
    };
  };
}
