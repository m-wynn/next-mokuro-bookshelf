import "tailwindcss/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faRegularBookmark } from "@fortawesome/free-regular-svg-icons";
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Book, getFromLocalStorage } from "../components/book";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

type FileData = {
  index: string;
  title: string;
  firstImage: string;
  numFiles: number;
  path: string;
};

type FolderData = {
  folderName: string;
  files: FileData[] | null;
};

type Props = {
  htmlFilesWithFolder: FolderData[];
  search: string;
};

export const getServerSideProps: GetServerSideProps<{
  htmlFilesWithFolder: FolderData[];
}> = async () => {
  const mokuroPath = path.join(process.cwd(), "/public/mokuro/");
  fs.mkdirSync(mokuroPath, { recursive: true });

  // Read all items (files and folders) within mokuroPath
  const items = await fs.promises.readdir(mokuroPath);

  // Filter out only the folders from the items list
  const folders = items.filter((item) =>
    fs.lstatSync(path.join(mokuroPath, item)).isDirectory()
  );

  const htmlFilesWithFolder: FolderData[] = (
    await Promise.all(
      folders.map(async (folder) => {
        const folderPath = path.join(mokuroPath, folder);
        const files = await fs.promises.readdir(folderPath);
        const htmlFiles: FileData[] = await Promise.all(
          files
            .filter((file) => file.endsWith(".html"))
            .map(async (index) => {
              const images = await fs.promises.readdir(
                path.join(folderPath, index.replace(".html", ""))
              );
              return {
                index,
                title: index.replace(".html", ""),
                firstImage: images[0],
                numFiles: images.length,
                path: `mokuro/${folder}/${index}`,
              };
            })
        );

        // Store the HTML files with their corresponding folder name
        return {
          folderName: folder,
          files: htmlFiles.length > 0 ? htmlFiles : null,
        };
      })
    )
  ).filter((folder) => folder.files !== null && folder.files.length > 0);

  return {
    props: {
      htmlFilesWithFolder,
    },
  };
};
const addBook = (title: string, image: string, numFiles: number) => {
  const book = {
    page_idx: 0,
    page2_idx: 1,
    hasCover: false,
    r2l: true,
    singlePageView: true,
    ctrlToPan: false,
    textBoxBorders: false,
    editableText: false,
    displayOCR: true,
    fontSize: "auto",
    eInkMode: false,
    defaultZoomMode: "fit to screen",
    toggleOCRTextBoxes: false,
    backgroundColor: "#C4C3D0",
    last_page_idx: numFiles - 1,
    cover_page: image,
  };
  // add book to local storage
  localStorage.setItem(title, JSON.stringify(book));
  window.dispatchEvent(new Event("storage"));
};

const removeBook = (title: string) => {
  localStorage.removeItem(title);
  window.dispatchEvent(new Event("storage"));
};
type BookToAddProps = {
  file: FileData;
  folderName: string;
  exists: boolean;
};

const BookToAdd: React.FC<BookToAddProps> = ({ file, folderName, exists }) => (
  <div
    key={file.index}
    className="w-36 h-[13.5rem] m-2 bookcard card card-compact image-full bg-base-300 flex-initial shadow hover:shadow-lg"
  >
    <figure className="overflow-hidden">
      <img
        src={`/mokuro/${folderName}/${file.title}/${file.firstImage}`}
        className={`w-36 h-[13.5rem] bg-cover bg-center bg-no-repeat flex items-center ${
          exists ? "opacity-70" : ""
        }`}
      />
    </figure>
    <div className="card-body">
      <div className="card-actions absolute top-0 right-0">
        {exists ? (
          <button
            title="Remove Bookmark"
            onClick={() => removeBook(`mokuro_/${file.path}`)}
            className="bg-surface2 text-base-300 hover:text-red-700 px-1"
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        ) : (
          <button
            title="Add Bookmark"
            className="bg-surface2 text-white hover:text-green-700 px-1"
            onClick={() =>
              addBook(`mokuro_/${file.path}`, file.firstImage, file.numFiles)
            }
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        )}
      </div>
      <Link href={file.path} className="grow">
        <h2 className="card-title text-[1.4rem] drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)] text-white">
          {file.title}
        </h2>
        {exists ? (
          <h2 className="card-title text-med drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]  text-white">
            In Library
          </h2>
        ) : (
          ""
        )}
      </Link>
    </div>
  </div>
);

const AddNew = ({ htmlFilesWithFolder, search }: Props) => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    function updateFromLocalStorage() {
      const books = getFromLocalStorage();

      setBooks(books);
      console.log("books", books);
    }
    updateFromLocalStorage();
    window.addEventListener("storage", updateFromLocalStorage);

    return () => {
      window.removeEventListener("storage", updateFromLocalStorage);
    };
  }, []);
  return (
    <div className="latte bg-crust text-text p-5">
      <Head>
        <title>Add New</title>
        <meta charSet="utf-8" />
      </Head>
      {htmlFilesWithFolder
        .filter(({ folderName, files }) =>
          folderName.toLowerCase().includes(search.toLowerCase())
        )
        .map(({ folderName, files }) => (
          <div key={folderName} className="mb-4 w-full">
            <div className="w-full flex-initial bg-ctp-surface1 p-4 shadow-md">
              <h3 className="text-3xl font-bold mb-2">{folderName}</h3>
              <div key={folderName} className="mb-4 w-full flex flex-wrap">
                {files?.map((file) => (
                  <BookToAdd
                    key={file.path}
                    folderName={folderName}
                    file={file}
                    exists={
                      books.find(
                        (book) => book.key === `mokuro_/${file.path}`
                      ) !== undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AddNew;
