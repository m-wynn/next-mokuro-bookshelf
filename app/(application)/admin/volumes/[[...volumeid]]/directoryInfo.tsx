'use client';

import { UseFormSetValue } from 'react-hook-form';
import Input from '@/input';
import { Series } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCheck, faFile, faFolder, faImage, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import SeriesSelect from './seriesselect';
import type { FormChild, VolumeData, VolumeFields } from './types';
import UploadButton from './uploadButton';

function VolumeUploadRow({
  volume,
  isFirst,
  setFirstPageIsCoverDict,
}: {
  volume: VolumeData,
  isFirst: boolean,
  setFirstPageIsCoverDict: (prev: object) => void
}) {
  const missingOcrPages = volume.pages.filter((pages) => !pages.ocr);
  return (
    <div className={`card lg:card-side bg-base-100 shadow-xl rounded-l-none ${isFirst ? '' : 'mt-2'}`}>
      <figure>
        { volume.coverPage
          ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(volume.coverPage)}
              alt={`Volume ${volume.number} cover`}
              className="h-36 w-auto"
            />
          ) : null}
      </figure>
      <div className="card-body">
        <div key={volume.number}>
          <b>Volume {volume.number}</b>:
          Cover: {volume.coverPage ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} className="text-error" />}
          {' '}
          Pages: {volume.pages.length > 0 ? <span>{volume.pages.length}</span> : <span className="text-error">{volume.pages.length}</span>}
          {' '}
          { missingOcrPages.length > 0 ? <span className="text-error">(Missing {missingOcrPages.length} OCR files)</span> : <span><FontAwesomeIcon icon={faCheck} /></span>}
          {' '}
        </div>
        <label className="flex-row w-full cursor-pointer label">
          <span className="flex-grow label-text">
            <FontAwesomeIcon icon={faBook} className="mr-4" />
            First Page Is Cover
          </span>
          <input
            type="checkbox"
            className="checkbox"
            onChange={(event) => {
              setFirstPageIsCoverDict((prev: object) => ({
                ...prev,
                [volume.number]: event.target.checked,
              }));
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default function DirectoryInfo({
  setValue,
  register,
  series,
  newSeriesModalRef,
  volumeData,
  setFirstPageIsCoverDict,
}: {
  setValue: UseFormSetValue<VolumeFields>;
  register: FormChild['register'];
  series: Series[];
  newSeriesModalRef: React.RefObject<HTMLDialogElement>;
  volumeData: VolumeData[];
  setFirstPageIsCoverDict: (prev: object) => void
}): JSX.Element {
  return (
    <>
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-seriesId">Directory Info</h2>
          <div className="flex flex-col justify-between items-center w-1/2">
            <SeriesSelect
              setValue={setValue}
              register={register}
              series={series}
              newSeriesModalRef={newSeriesModalRef}
            />
            <Input
              label="Directory"
              type="file"
              classNameOverride="w-full max-w-xs file-input file-input-bordered"
              register={register('directory', {
                required: 'Directory is required',
              })}
              extraProperties={{ directory: '', webkitdirectory: '' }}
            />
          </div>
          <div className="divider"></div>
          <div className="flex flex-row">
            <ul className="min-w-40">
              <li><FontAwesomeIcon icon={faFolder} /> Manga Name
                <ul className="ml-5">
                  <li><FontAwesomeIcon icon={faFolder} />ocr
                    <ul className="ml-5">
                      <li><FontAwesomeIcon icon={faFolder} />Volume 1
                        <ul className="ml-5">
                          <li><FontAwesomeIcon icon={faFile} /> 001.json</li>
                          <li><FontAwesomeIcon icon={faFile} /> 002.json</li>
                          <li><FontAwesomeIcon icon={faFile} /> 003.json</li>
                          <li><FontAwesomeIcon icon={faFile} /> ...</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><FontAwesomeIcon icon={faFolder} />Volume 1
                    <ul className="ml-5">
                      <li><FontAwesomeIcon icon={faImage} /> cover.jpg</li>
                      <li><FontAwesomeIcon icon={faImage} /> 001.jpg</li>
                      <li><FontAwesomeIcon icon={faImage} /> 002.jpg</li>
                      <li><FontAwesomeIcon icon={faImage} /> 003.jpg</li>
                      <li><FontAwesomeIcon icon={faImage} /> ...</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="divider divider-horizontal" />
            <div className="grow">
              {volumeData.map((volume, idx) => (
                <VolumeUploadRow
                  key={volume.number}
                  volume={volume}
                  isFirst={idx === 0}
                  setFirstPageIsCoverDict={setFirstPageIsCoverDict}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="divider" />
      <UploadButton>Upload Directory</UploadButton>
    </>
  );
}
