import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';  // Import Tailwind CSS

export async function getServerSideProps() {
  const mokuroPath = path.join(process.cwd(), '/public/mokuro/');
  console.log(mokuroPath);

  // Read all items (files and folders) within mokuroPath
  const items = await fs.promises.readdir(mokuroPath);

  // Filter out only the folders from the items list
  const folders = items.filter(item => fs.lstatSync(path.join(mokuroPath, item)).isDirectory());

  // Initialize an array to store the HTML files with their folder name
  const htmlFilesWithFolder = [];

  // Loop through each folder to find HTML files within them
  for (const folder of folders) {
    const folderPath = path.join(mokuroPath, folder);
    const files = await fs.promises.readdir(folderPath);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    // Store the HTML files with their corresponding folder name
    htmlFilesWithFolder.push({ folderName: folder, files: htmlFiles });
  }

  return {
    props: {
      htmlFilesWithFolder,
    },
  };
}

const AddNew = ({ htmlFilesWithFolder }) => (
  <div className="bg-white text-black p-5">  {/* Added Tailwind classes */}
    <Head>
      <title>Add New</title>
      <meta charSet="utf-8" />
    </Head>
    <h2 className="text-2xl font-bold mb-4">mokuro</h2>  {/* Added Tailwind classes */}
    {htmlFilesWithFolder.map(({ folderName, files }) => (
      <div key={folderName} className="mb-4">  {/* Added Tailwind class */}
        <h3 className="text-3xl font-bold mb-2">{folderName}</h3>  {/* Added Tailwind class */}
        {files.map(file => (
          <Link key={file} href={`/mokuro/${folderName}/${file}`} className="text-blue-500 hover:underline"> {/* Added Tailwind classes */}
            {file.replace('.html', '')}
          </Link>
        ))}
      </div>
    ))}
  </div>
);

export default AddNew;
