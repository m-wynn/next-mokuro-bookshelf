'use client';

import Input from '@/input';
import VolumeCard from '@/volumecard';
import { Series } from '@prisma/client';
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import type { FormChild, VolumeFields } from './page';

export default function DirectoryInfo({
  errors,
  setValue,
  register,
  watch,
  series,
  newSeriesModalRef,
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
  const volumeNumber = watch('volumeNumber');
  const coverFile = watch('coverImage');

  useEffect(() => {
    if (coverFile && coverFile[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setCoverUri(e.target.result);
        }
      };
      reader.readAsDataURL(coverFile[0]);
    }
  }, [coverFile]);

  return (
    <div className="card bg-base-300 rounded-box">
      <div className="items-center card-body">
        <h2 className="card-seriesId">Basic Info</h2>
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col justify-between items-center w-1/2">
            <div className="w-full max-w-xs">
              <label className="label">
                <span className="label-text">Manga Series</span>
              </label>
              <select
                className="w-full max-w-xs select"
                defaultValue="Manga Series"
                {...register('seriesEnglishName', {
                  required: 'Manga Series is required',
                  // TODO: don't let this be "Add New" or something
                })}
                onChange={(e) => {
                  if (e.target.value === 'Add New') {
                    newSeriesModalRef.current?.showModal();
                  } else {
                    setValue('seriesEnglishName', e.target.value);
                  }
                }}
              >
                <option disabled>Manga Series</option>
                {series.map((each) => (
                  <option key={each.englishName} value={each.englishName}>
                    {each.englishName}
                  </option>
                ))}
                <option key="new" className="font-bold">
                  Add New
                </option>
              </select>
            </div>
            <Input
              label="Directory"
              type="file"  
              classNameOverride={`w-full max-w-xs file-input file-input-bordered ${
                errors?.coverImage && 'file-input-error'
              }`}
              errors={errors?.coverImage || null}
              register={register('coverImage', {
                required: 'Directory is required',
                onChange: (event) => {
    const files = event.target.files;
    const fileList = [];

    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].webkitRelativePath);
    }

    console.log(fileList);
  }
              })}
              extraProperties={{'directory': '', 'webkitdirectory': ''}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
