declare module 'search' {
  export interface SearchResult {
    pageId: number;
    number: number;
    volumeid: string;
    volumeNumber: number;
    seriesId: string;
    japaneseName: string;
    englishName: string;
    text: string;
    isReading: boolean;
    blockNumber: number;
  }
}
