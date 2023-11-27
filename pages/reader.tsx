import { GetServerSideProps } from "next";
import { promises as fs } from "fs";
import path from "path";
import { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getFromLocalStorage, LocalStorageBook } from "../components/book";

type ReaderProps = {
  pages: Page[];
  book: string;
  volume: string;
};

type Page = {
  image: string;
  contents: OcrContents;
};

type OcrContents = {
  version: string;
  img_width: number;
  img_height: number;
  blocks: OcrBlock[];
};

type OcrBlock = {
  box: number[];
  vertical: boolean;
  font_size: number;
  lines_coords: number[][];
  lines: string[];
};

type QueryParams = {
  book: string;
  volume: string;
};

export const getServerSideProps: GetServerSideProps<{
  pages: Page[];
}> = async ({ query }) => {
  console.log("getting server side props");
  // This is a ServerSideProp because someday it will be a database query
  const { book, volume } = query as QueryParams;
  const mokuroPath = path.join(process.cwd(), "/public/mokuro/");
  const folderPath = path.join(mokuroPath, book, "_ocr", `Volume ${volume}`);
  const files = await fs.readdir(folderPath);
  const pages: Page[] = await Promise.all(
    files.map(async (filename) => {
      const file = path.join(folderPath, filename);
      const image = path.join(
        "mokuro",
        book,
        `Volume ${volume}`,
        filename.replace(".json", ".jpg")
      );
      const fileContents = await fs.readFile(file, "utf8");
      const contents: OcrContents = JSON.parse(fileContents.toString());
      return {
        image,
        contents,
      };
    })
  );
  console.log(pages.length);
  return {
    props: {
      pages,
      volume,
      book,
    },
  };
};

export const Reader = ({ pages, volume, book }: ReaderProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageRef = useRef<number>(null);
  pageRef.current = currentPage;
  const boundPage = (page: number) =>
    Math.min(pages.length - 1, Math.max(0, page));

  const oneIndexedPage = currentPage + 1;

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        setCurrentPage(boundPage(pageRef.current - 1));
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        setCurrentPage(boundPage(pageRef.current + 1));
        break;
    }
  };
  useEffect(() => {
    const [bookStorage] = getFromLocalStorage(
      `mokuro/${book}/Volume ${volume}.html`
    );
    setCurrentPage(bookStorage?.page || 0);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let book = new LocalStorageBook();
    book.updateLocalStorage(`mokuro/${book}/Volume ${volume}.html`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const page = pages[currentPage];
  return (
    <div id="pagesContainer" className="m-0 w-full h-full">
      <div className="join">
        <button
          className="join-item btn"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(boundPage(pageRef.current - 1))}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {currentPage !== 0 && (
          <>
            <button
              className="join-item btn btn-square"
              onClick={() => setCurrentPage(0)}
            >
              1
            </button>
            {currentPage > 3 && (
              <button className="join-item btn btn-square pointer-events-none">
                &#x2026;
              </button>
            )}
            {currentPage == 3 && (
              <button
                className="join-item btn btn-square"
                onClick={() => setCurrentPage(1)}
              >
                2
              </button>
            )}
            {currentPage > 1 && (
              <button
                className="join-item btn btn-square"
                onClick={() => setCurrentPage(pageRef.current - 1)}
              >
                {oneIndexedPage - 1}
              </button>
            )}
          </>
        )}
        <div className="w-12">
          <EnterInput
            className="input join-item m-0 w-12 p-0 text-center focus:outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            defaultValue={oneIndexedPage}
            onSubmit={(value: number) => {
              setCurrentPage(boundPage(value - 1));
            }}
          />
        </div>
        {currentPage <= pages.length - 1 && (
          <>
            {currentPage < pages.length - 2 && (
              <button
                className="join-item btn btn-square"
                onClick={() => setCurrentPage(boundPage(pageRef.current + 1))}
              >
                {oneIndexedPage + 1}
              </button>
            )}
            {currentPage == pages.length - 4 && (
              <button
                className="join-item btn btn-square"
                onClick={() => setCurrentPage(pages.length - 2)}
              >
                {pages.length - 1}
              </button>
            )}
            {currentPage < pages.length - 4 && (
              <button className="join-item btn btn-square pointer-events-none">
                &#x2026;
              </button>
            )}
            {currentPage < pages.length - 1 && (
              <button
                className="join-item btn btn-square"
                onClick={() => setCurrentPage(pages.length - 1)}
              >
                {pages.length}
              </button>
            )}
          </>
        )}
        <button
          className="join-item btn"
          disabled={currentPage === pages.length - 1}
          onClick={() => setCurrentPage(boundPage(pageRef.current + 1))}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <TransformWrapper
        limitToBounds={false}
        centerOnInit={true}
        minScale={0.5}
        panning={{
          velocityDisabled: true,
          excluded: ["leading-none", "group"],
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className="page">
            <div
              className="pageContainer"
              style={{
                width: page.contents.img_width,
                height: page.contents.img_height,
                backgroundImage: `url("${page.image}")`,
                fontFamily: "Noto Sans JP",
              }}
            >
              {page.contents.blocks.map((block: OcrBlock) => (
                <div
                  className="group textBox absolute hover:bg-white justify-between flex"
                  key={block.box.join(",")}
                  style={{
                    left: block.box[0],
                    top: block.box[1],
                    width: block.box[2] - block.box[0],
                    height: block.box[3] - block.box[1],
                    // assign z-index ordering from largest to smallest boxes
                    // so that the smaller boxes don't get hidden underneath larger ones
                    zIndex:
                      10000 -
                      ((block.box[2] - block.box[0]) *
                        (block.box[3] - block.box[1])) /
                        1000,
                    flexDirection: block.vertical ? "row-reverse" : "column",
                  }}
                >
                  {block.lines.map((line: string, i: number) => (
                    <div
                      key={i}
                      className="hidden group-hover:inline-block whitespace-nowrap leading-none select-text mx-auto"
                      style={{
                        fontSize:
                          block.font_size < 12
                            ? 12
                            : block.font_size > 32
                            ? 32
                            : block.font_size,
                        writingMode: block.vertical
                          ? "vertical-rl"
                          : "horizontal-tb",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
      {currentPage < pages.length - 1 && (
        <div
          className="display-none"
          style={{
            backgroundImage: `url("${pages[currentPage + 1].image}")`,
          }}
        ></div>
      )}
      {currentPage >= 1 && (
        <div
          className="display-none"
          style={{
            backgroundImage: `url("${pages[currentPage - 1].image}")`,
          }}
        ></div>
      )}
    </div>
  );
};

const EnterInput = ({ className, defaultValue, onSubmit }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <input
      type="number"
      pattern="[0-9]*"
      className={className}
      placeholder="pg"
      value={value}
      onChange={(e) => {
        setValue(e.target.validity.valid ? e.target.value : value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmit(value);
        }
      }}
    />
  );
};

export default Reader;
