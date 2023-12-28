import { useSession } from "next-auth/react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
// import { volume, getFromLocalStorage } from "../../components/book";
import Link from "next/link";
import { auth } from "auth/lucia";
import * as context from "next/headers";
import VolumeCard from "@/volumecard";

type VolumeCardProps = {
  reading: Reading;
  onDelete: (key: string) => void;
};

type ShelfProps = {
  title: string;
  readings: Reading[];
  onDelete: (key: string) => void;
};

const Shelf = ({ title, readings, onDelete }: ShelfProps) => {
  return (
    <div className="p-4 m-4 shadow-lg bg-base-200">
      <h1 className="mb-4 text-4xl font-bold text">{title}</h1>
      <div className="flex flex-wrap mb-6 section">
        {readings.map((reading) => (
          <VolumeCard
            key={reading.volume.id}
            coverUri={`/images/${reading.volume.id}/cover/${reading.volume.cover}`}
            percentComplete={8}
            href={`/reader/${reading.volume.series.id}/${reading.volume.number}`}
            reading={reading}
            seriesName={reading.volume.series.name}
            volumeNumber={reading.volume.number}
          />
        ))}
      </div>
    </div>
  );
};

type Reading = {
  id: number;
  page: number;
  status: string;
  updatedAt: string;
  volume: {
    number: number;
    id: number;
    seriesId: number;
    cover: string;
    series: {
      name: string;
      id: string;
    };
  };
};

const Bookshelf = async () => {
  const session = await auth.handleRequest("GET", context).validate();
  const readings = await prisma.reading.findMany({
    where: {
      userId: session.userId,
    },
    select: {
      id: true,
      page: true,
      status: true,
      updatedAt: true,
      volume: {
        select: {
          number: true,
          id: true,
          seriesId: true,
          cover: true,
          series: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  const search = "";

  const current = readings.filter(
    (reading) =>
      reading.status === "READING" &&
      `${reading.volume.series.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const unread = readings.filter(
    (reading) =>
      reading.status === "UNREAD" &&
      `${reading.volume.series.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const read = readings.filter(
    (reading) =>
      reading.status === "READ" &&
      `${reading.volume.series.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div>
      {current.length === 0 && unread.length === 0 && read.length === 0 && (
        <div className="alert">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <span>
            No readings found
            {search != "" ? ` for '${search || "bookshelf"}'` : ""}
          </span>
          <div>
            <Link href="/addnew">
              <button className="btn btn-sm btn-primary">Add Some</button>
            </Link>
          </div>
        </div>
      )}
      {current.length > 0 && <Shelf title="Reading" readings={current} />}
      {unread.length > 0 && <Shelf title="Future" readings={unread} />}
      {read.length > 0 && <Shelf title="Finished" readings={read} />}
    </div>
  );
};

export default Bookshelf;
