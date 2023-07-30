// Typescript book class
export class Book {
  key: string;
  seriesName: string;
  path: string;
  fileName: string;
  mokuro: {
    cover_page: string;
    page_idx: number;
    last_page_idx: number;
  };
  coverPage: string;
  page: number;
  progressStatus: "reading" | "finished" | "future";
  percentComplete: number;
  remainingPages: number;
}
const determineProgressStatus = (
  currentPage: number,
  totalPages: number
): "future" | "finished" | "reading" => {
  if (1 === currentPage) {
    return "future";
  } else if (currentPage === totalPages) {
    return "finished";
  } else {
    return "reading";
  }
};

export function getFromLocalStorage(): Book[] {
  const keys = Object.keys(localStorage);
  const storagePrefix = "mokuro_";

  return keys
    .filter((key) => key.startsWith(storagePrefix))
    .map((key) => {
      const path = decodeURI(key.substring(storagePrefix.length));
      const fileName = path.split("/").pop().replace(".html", "");
      const seriesName = path.split("/").slice(-2)[0];
      const mokuro = JSON.parse(localStorage.getItem(key));

      return {
        key,
        seriesName,
        path,
        fileName,
        mokuro,
        coverPage: `${path.replace(".html", "")}/${mokuro.cover_page}`,
        page: mokuro.page_idx,
        progressStatus: determineProgressStatus(
          mokuro.page_idx + 1,
          mokuro.last_page_idx
        ),
        percentComplete: Math.floor(
          ((mokuro.page_idx + 1) / mokuro.last_page_idx) * 100
        ),
        remainingPages: mokuro.last_page_idx - (mokuro.page_idx + 1),
      };
    });
}
