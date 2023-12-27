"use client";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
// import { volume, getFromLocalStorage } from "../../components/book";
import Link from "next/link";
import * as context from "next/headers";

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
            reading={reading}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

const VolumeCard = ({ reading, onDelete }: VolumeCardProps) => {
  const deletevolume = () => {
    // onDelete(reading.volume.id);
  };

  return (
    <div
      key={reading.volume.id}
      className="flex-initial m-2 shadow hover:shadow-lg w-[13.5rem] h-[20.25rem] readingcard card card-compact image-full"
    >
      <figure className="overflow-hidden">
        <img
          src={`/images/${reading.volume.id}/cover/${reading.volume.cover}`}
          alt={`${reading.volume.series.name}'s cover could not be loaded.  It may need to be re-added`}
          className="flex items-center bg-center bg-no-repeat bg-cover w-[13.5rem] h-[20.25rem]"
        />
      </figure>
      {reading.status === "READING" ? (
        <progress
          className="absolute bottom-3 z-50 rounded-none progress progress-primary w-[13.5rem]"
          value={8}
          max="100"
        ></progress>
      ) : (
        ""
      )}
      <div className="card-body">
        <div className="absolute top-0 right-0 card-actions">
          <button className="text-white btn btn-circle btn-xs no-animation btn-ghost hover:text-error">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <Link
          href={`/reader/${reading.volume.series.id}/${reading.volume.number}`}
          className="grow"
        >
          <h2 className="card-title text-[1.6rem] drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)] text-white">
            {reading.volume.series.name}
          </h2>
          <h2 className="card-title drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]  text-white">
            {reading.volume.number}
          </h2>
        </Link>
      </div>
    </div>
  );
};

type bookShelfProps = {
  search: string;
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

const Bookshelf = ({ search = "" }: bookShelfProps) => {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const fetchReadings = async () => {
      const res = await fetch("/api/readingProgress");
      const readings = await res.json();
      setReadings(readings);
    };
    fetchReadings();
  }, [setReadings]);

  const deletevolume = (key: string) => {
    // TODO
  };
  const current = useMemo(
    () =>
      readings.filter(
        (reading) =>
          reading.status === "READING" &&
          `${reading.volume.series.name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [readings, search],
  );
  const unread = useMemo(
    () =>
      readings.filter(
        (reading) =>
          reading.status === "UNREAD" &&
          `${reading.volume.series.name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [readings, search],
  );
  const read = useMemo(
    () =>
      readings.filter(
        (reading) =>
          reading.status === "READ" &&
          `${reading.volume.series.name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [readings, search],
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
      {current.length > 0 && (
        <Shelf title="Reading" readings={current} onDelete={deletevolume} />
      )}
      {unread.length > 0 && (
        <Shelf title="Future" readings={unread} onDelete={deletevolume} />
      )}
      {read.length > 0 && (
        <Shelf title="Finished" readings={read} onDelete={deletevolume} />
      )}
    </div>
  );
};

export default Bookshelf;
