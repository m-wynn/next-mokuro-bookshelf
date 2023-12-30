import Link from "next/link";

type VolumeCardProps = {
  coverUri: string;
  pagesRead?: number;
  totalPages?: number;
  href: string;
  seriesName: string;
  volumeNumber: number;
  children?: React.ReactNode;
};

const VolumeCard = ({
  coverUri,
  pagesRead,
  totalPages,
  volumeNumber,
  seriesName,
  href,
  children,
}: VolumeCardProps) => {
  return (
    <div className="flex-initial m-2 shadow hover:shadow-lg w-[13.5rem] h-[20.25rem] readingcard card card-compact image-full bg-base-300">
      <figure className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUri}
          alt={`${seriesName} volume ${volumeNumber}`}
          className="flex items-center bg-center bg-no-repeat bg-cover w-[13.5rem] h-[20.25rem]"
        />
      </figure>
      {pagesRead && totalPages ? (
        <progress
          className="absolute bottom-3 z-50 rounded progress progress-primary w-[13.5rem]"
          value={pagesRead}
          max={totalPages}
        ></progress>
      ) : (
        ""
      )}
      <div className="card-body">
        <div className="absolute top-0 right-0 z-20 card-actions">
          {children}
        </div>
        <Link href={href} className="z-[1] grow">
          <h2 className="card-title text-[1.6rem] drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)] text-white">
            {seriesName}
          </h2>
          <h2 className="card-title drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]  text-white">
            Volume {volumeNumber}
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default VolumeCard;
