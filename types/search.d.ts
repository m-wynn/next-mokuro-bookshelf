declare module 'search' {
  export interface SearchResult {
    id: number;
    number: number;
    volumeid: string;
    volumeNumber: number;
    seriesId: string;
    japaneseName: string;
    englishName: string;
    text: string;
    score: number;
    isReading: boolean;
    blockNumber: number;
  }
}
