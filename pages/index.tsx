import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Book, getFromLocalStorage } from "../components/book";

type ProgressBarProps = {
  progress: number;
  page: number;
};

type BookCardProps = {
  book: Book;
  onDelete: (key: string) => void;
};

type ShelfProps = {
  title: string;
  books: Book[];
  onDelete: (key: string) => void;
};

const Shelf: React.FC<ShelfProps> = ({ title, books, onDelete }) => {
  return (
    <div className="bg-surface1 p-4 mb-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="section flex mb-6">
        {books.map((book) => (
          <BookCard key={book.key} book={book} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, page }) => {
  return (
    <div className="relative h-6 bg-crust">
      <div className="h-6 bg-peach" style={{ width: `${progress}%` }}></div>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-text">
        {progress}% (pg {page})
      </span>
    </div>
  );
};

const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  const deleteBook = () => {
    onDelete(book.key);
  };

  return (
    <div
      key={book.key}
      className="m-2 w-44 flex-initial shadow hover:shadow-lg"
    >
      <div className="w-44 h-64 overflow-hidden relative">
        <a href={book.path}>
          <img
            src={book.coverPage}
            alt={book.fileName}
            className="absolute max-w-none h-64"
          />
        </a>
        <button
          onClick={deleteBook}
          title="Remove Bookmark"
          className="bg-lavender text-crust rounded-bl-lg absolute right-0 top-0 px-2 hover:text-red"
        >
          <FontAwesomeIcon icon={faBookmark} />
        </button>
        <div className="absolute bg-lavender px-2 font-bold text-crust right-0 bottom-0 rounded-tl-lg">
          {book.seriesName} - {book.fileName}
        </div>
      </div>
      <ProgressBar progress={book.percentComplete} page={book.page} />
    </div>
  );
};

const Bookshelf: React.FC = () => {
  const [sortAscending, setSortAscending] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState<"title" | "remainingPages">("title");

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
    (book) => book.progressStatus === "reading"
  );
  const finishedBooks = books.filter(
    (book) => book.progressStatus === "finished"
  );
  const futureBooks = books.filter((book) => book.progressStatus === "future");

  return (
    <div className="root latte bg-base p-5">
      <Head>
        <title>Bookshelf</title>
        <meta charSet="utf-8" />
      </Head>

      {readingBooks.length > 0 && (
        <Shelf title="Reading" books={readingBooks} onDelete={deleteBook} />
      )}

      {futureBooks.length > 0 && (
        <Shelf title="Future" books={futureBooks} onDelete={deleteBook} />
      )}

      {finishedBooks.length > 0 && (
        <Shelf title="Finished" books={finishedBooks} onDelete={deleteBook} />
      )}
      <Link href={`/addnew`}>
        <button className="bg-lavender text-white p-3 h-16 text-2xl absolute top-0 right-0">
          Manage Bookshelf
        </button>
      </Link>
    </div>
  );
};

export default Bookshelf;
