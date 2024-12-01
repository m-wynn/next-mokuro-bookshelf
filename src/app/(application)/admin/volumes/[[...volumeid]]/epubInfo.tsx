import type { UseFormSetValue } from 'react-hook-form';
import { Series } from '@prisma/client';
import React from 'react';
import Input from '@/input';
import Info from './info';
import UploadButton from './uploadButton';
import type { FormChild, VolumeFields } from './types';

export default function EpubInfo({
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
  return (
    <>
      <Info
        newSeriesModalRef={newSeriesModalRef}
        register={register}
        watch={watch}
        errors={errors}
        series={series}
        setValue={setValue}
      />
      <div className="divider" />
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-title">EPub File</h2>
          <div className="flex flex-row justify-around w-full">
            <div className="flex flex-col justify-between items-center w-1/2">
              <Input
                label="EPub File"
                type="file"
                pattern="application/epub+zip"
                extraProperties={{ accept: 'application/epub+zip', multiple: false }}
                classNameOverride={`w-full max-w-xs file-input file-input-bordered ${
                  errors?.epub && 'file-input-error'
                }`}
                errors={errors?.coverImage || null}
                register={register('epub', {
                  required: 'Epub is required',
                })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="divider" />
      <UploadButton>Upload Volume</UploadButton>
    </>
  );
}
