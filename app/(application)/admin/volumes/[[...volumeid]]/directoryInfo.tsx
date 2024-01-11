'use client';

import { UseFormSetValue } from 'react-hook-form';
import Input from '@/input';
import { Series } from '@prisma/client';
import SeriesSelect from './seriesselect';
import type { FormChild, VolumeFields } from './types';
import UploadButton from './uploadButton';

export default function DirectoryInfo({
  setValue,
  register,
  series,
  newSeriesModalRef,
}: {
  setValue: UseFormSetValue<VolumeFields>;
  register: FormChild['register'];
  series: Series[];
  newSeriesModalRef: React.RefObject<HTMLDialogElement>;
}): JSX.Element {
  return (
    <>
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-seriesId">Directory Info</h2>
          <div className="flex flex-row justify-around w-full">
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
          </div>
        </div>
      </div>
      <div className="divider" />
      <UploadButton>Upload Directory</UploadButton>
    </>
  );
}
