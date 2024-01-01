declare module 'page' {
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
}
