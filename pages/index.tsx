import { useEffect, useState } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Book, getFromLocalStorage } from "../components/book";
import Navbar from "../components/navbar";
import Link from "next/link";

type BookCardProps = {
  book: Book;
  onDelete: (key: string) => void;
};

type ShelfProps = {
  title: string;
  books: Book[];
  onDelete: (key: string) => void;
};

const Shelf = ({ title, books, onDelete }: ShelfProps) => {
  return (
    <div className="bg-ctp-surface2 p-4 mb-4 shadow-lg">
      <h1 className="text text-4xl font-bold mb-4">{title}</h1>
      <div className="section flex flex-wrap mb-6">
        {books.map((book) => (
          <BookCard key={book.key} book={book} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

const BookCard = ({ book, onDelete }: BookCardProps) => {
  const deleteBook = () => {
    onDelete(book.key);
  };

  return (
    <div
      key={book.key}
      className="w-[13.5rem] h-[20.25rem] m-2 bookcard card card-compact image-full bg-base-300 flex-initial shadow hover:shadow-lg"
    >
      <figure className="overflow-hidden">
        <img
          src={book.coverPage}
          alt={`${book.fileName}'s cover could not be loaded.  It may need to be re-added`}
          className="w-[13.5rem] h-[20.25rem] bg-cover bg-center bg-no-repeat flex items-center"
        />
      </figure>
      {book.progressStatus === "reading" ? (
        <progress
          className="progress progress-primary w-[13.5rem] z-50 rounded-none absolute bottom-3"
          value={book.percentComplete}
          max="100"
        ></progress>
      ) : (
        ""
      )}
      <div className="card-body">
        <div className="card-actions absolute top-0 right-0">
          <button
            className="btn btn-circle btn-xs no-animation btn-ghost text-white hover:text-error"
            onClick={deleteBook}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <Link href={book.path} className="grow">
          <h2 className="card-title text-[1.6rem] drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)] text-white">
            {book.seriesName}
          </h2>
          <h2 className="card-title drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]  text-white">
            {book.fileName}
          </h2>
        </Link>
      </div>
    </div>
  );
};

type BookShelfProps = {
  search: string;
};

const Bookshelf = ({ search }: BookShelfProps) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    function updateFromLocalStorage() {
      const books = getFromLocalStorage();

      setBooks(books);
    }
    updateFromLocalStorage();
    window.addEventListener("storage", updateFromLocalStorage);

    return () => {
      window.removeEventListener("storage", updateFromLocalStorage);
    };
  }, []);

  const deleteBook = (key: string) => {
    localStorage.removeItem(key);
    setBooks((prevBooks) => prevBooks.filter((book) => book.key !== key));
  };
  const readingBooks = books.filter(
    (book) =>
      book.progressStatus === "reading" &&
      `${book.fileName} ${book.seriesName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );
  const finishedBooks = books.filter(
    (book) =>
      book.progressStatus === "finished" &&
      `${book.fileName} ${book.seriesName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );
  const futureBooks = books.filter(
    (book) =>
      book.progressStatus === "future" &&
      `${book.fileName} ${book.seriesName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="root latte bg-ctp-base p-5">
      <Head>
        <title>Bookshelf</title>
        <meta charSet="utf-8" />
      </Head>
      {readingBooks.length === 0 &&
        futureBooks.length === 0 &&
        finishedBooks.length === 0 && (
          <div className="alert">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>No books found{search != "" ? ` for '${search}'` : ""}</span>
            <div>
              <Link href="/addnew">
                <button className="btn btn-sm btn-primary">Add Some</button>
              </Link>
            </div>
          </div>
        )}
      {readingBooks.length > 0 && (
        <Shelf title="Reading" books={readingBooks} onDelete={deleteBook} />
      )}
      {futureBooks.length > 0 && (
        <Shelf title="Future" books={futureBooks} onDelete={deleteBook} />
      )}
      {finishedBooks.length > 0 && (
        <Shelf title="Finished" books={finishedBooks} onDelete={deleteBook} />
      )}
    </div>
  );
};

export default Bookshelf;
