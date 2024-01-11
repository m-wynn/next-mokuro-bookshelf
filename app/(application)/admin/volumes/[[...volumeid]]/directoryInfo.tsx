'use client';

import Input from '@/input';
import { Series } from '@prisma/client';
import SeriesSelect from './seriesselect';
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import type { FormChild, VolumeFields } from './page';

export default function DirectoryInfo({
  errors,
  setValue,
  register,
  watch,
  series,
  newSeriesModalRef
}: {
  errors: FormChild['errors'];
  setValue: UseFormSetValue<VolumeFields>;
  register: FormChild['register'];
  watch: FormChild['watch'];
  series: Series[];
  newSeriesModalRef: React.RefObject<HTMLDialogElement>;
}): JSX.Element {
  const [coverUri, setCoverUri] = useState('');

  const seriesEnglishName = watch('seriesEnglishName');

  return (
    <div className="card bg-base-300 rounded-box">
      <div className="items-center card-body">
        <h2 className="card-seriesId">Basic Info</h2>
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
              classNameOverride={`w-full max-w-xs file-input file-input-bordered`}
              register={register('directory', {
                required: 'Directory is required',
              })}
              extraProperties={{'directory': '', 'webkitdirectory': ''}}
            />
            <div className="flex flex-col-reverse items-center w-1/2">
              <button type="submit" className="w-full btn btn-primary">
                Upload Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
