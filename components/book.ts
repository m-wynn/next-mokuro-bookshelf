export class Book {
  key: string;
  seriesName: string;
  path: string;
  fileName: string;
  mokuro: LocalStorageBook;
  coverPage: string;
  page: number;
  progressStatus: "reading" | "finished" | "future";
  percentComplete: number;
  remainingPages: number;
}

export class LocalStorageBook {
  page_idx: number = 0;
  page2_idx: number = 1;
  hasCover: boolean = false;
  r2l: boolean = true;
  singlePageView: boolean = true;
  ctrlToPan: boolean = false;
  textBoxBorders: boolean = false;
  editableText: boolean = false;
  displayOCR: boolean = true;
  fontSize: string = "auto";
  eInkMode: boolean = false;
  defaultZoomMode: string = "fit to screen";
  toggleOCRTextBoxes: boolean = false;
  backgroundColor: string = "#C4C3DO";
  last_page_idx: number;
  cover_page: string;

  updateLocalStorage = (key: string) => {
    localStorage.setItem(`mokuro_${key}`, JSON.stringify(self));
  };
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

export function getFromLocalStorage(key?: string): Book[] {
  const keys = Object.keys(localStorage);
  var storagePrefix = "mokuro_";

  if (key != null) {
    storagePrefix = `${storagePrefix}/${key}`;
  }

  return keys
    .filter((key) => key.startsWith(storagePrefix))
    .map((key) => {
      const path = decodeURI(key.substring(storagePrefix.length));
      const fileName = path.split("/").pop().replace(".html", "");
      const seriesName = path.split("/").slice(-2)[0];
      const mokuro: LocalStorageBook = JSON.parse(localStorage.getItem(key));

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
