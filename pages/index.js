import { useEffect, useState } from 'react';
import Head from 'next/head';

const ProgressBar = ({ progress, remaining }) => {
  return (
    <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
      <div className="h-full bg-green-500" style={{width: `${progress}%`}}>
        <span className="text-white text-sm">{progress}% ({remaining}p)</span>
      </div>
    </div>
  );
};

const Bookshelf = () => {
  const [sortAscending, setSortAscending] = useState(true);
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState('title');

  const determineProgressStatus = (currentPage, totalPages) => {
    if (1 === currentPage) {
      return 'future';
    } else if (currentPage === totalPages) {
      return 'finished';
    } else {
      return 'reading';
    }
  };

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const storagePrefix = "mokuro_";

    const books = keys.filter(key => key.startsWith(storagePrefix)).map(key => {
      const path = decodeURI(key.substring(storagePrefix.length));
      const fileName = path.split('/').pop().replace('.html', '');
      const mokuro = JSON.parse(localStorage.getItem(key));

      return {
        key,
        path,
        fileName,
        mokuro,
        coverPage: `${path.replace('.html', '')}/${mokuro.cover_page}`,
        progressStatus: determineProgressStatus(mokuro.page_idx + 1, mokuro.last_page_idx),
        percentComplete: parseInt((mokuro.page_idx + 1)/mokuro.last_page_idx*100),
        remainingPages: mokuro.last_page_idx - (mokuro.page_idx + 1)
      }
    });

    setBooks(books);
  }, []);

  const changeReadingSort = (newSortBy) => {
    setSortBy(newSortBy);
    setBooks(prevBooks => [...prevBooks].sort((a, b) => a[newSortBy].localeCompare(b[newSortBy])));
  };

  const changeSortDirection = () => {
    setSortAscending(prevSortAscending => !prevSortAscending);
    setBooks(prevBooks => [...prevBooks].reverse());
  };

  const deleteFromMokuro = (key) => {
    localStorage.removeItem(key);
    setBooks(prevBooks => prevBooks.filter(book => book.key !== key));
  };

  return (
    <div className="bg-white text-black p-5">
      <Head>
        <title>Bookshelf</title>
        <meta charSet="utf-8"/>
      </Head>

      <h2 className="text-2xl font-bold mb-4">Reading</h2>

      <div className="mb-3 flex items-center">
        <span className="mr-2">Sort by:</span>
        <button onClick={() => changeReadingSort('remainingPages')} className="px-2 py-1 bg-blue-500 text-white rounded">Pages Remaining</button>
        <span onClick={changeSortDirection} className="ml-2 cursor-pointer">⇅</span>
      </div>

      <div id="reading" className="section mb-6">
        {books.map(book => book.progressStatus === 'reading' &&
          <div key={book.key} className="mb-4">
            <a href={book.path}>
              <img src={book.coverPage} alt={book.fileName} className="w-32"/>
            </a>
            <ProgressBar progress={book.percentComplete} remaining={book.remainingPages}/>
            <button onClick={() => deleteFromMokuro(book.key)} className="mt-2 px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Future</h2>

      <div id="future" className="section mb-6">
        {books.map(book => book.progressStatus === 'future' &&
          <div key={book.key} className="mb-4">
            <a href={book.path}>
              <img src={book.coverPage} alt={book.fileName} className="w-32"/>
            </a>
            <ProgressBar progress={book.percentComplete} remaining={book.remainingPages}/>
            <button onClick={() => deleteFromMokuro(book.key)} className="mt-2 px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Finished</h2>

      <div id="finished" className="section">
        {books.map(book => book.progressStatus === 'finished' &&
          <div key={book.key} className="mb-4">
            <a href={book.path}>
              <img src={book.coverPage} alt={book.fileName} className="w-32"/>
            </a>
            <ProgressBar progress={book.percentComplete} remaining={book.remainingPages}/>
            <button onClick={() => deleteFromMokuro(book.key)} className="mt-2 px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookshelf;
