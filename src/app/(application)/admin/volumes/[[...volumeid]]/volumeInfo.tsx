import type { UseFormSetValue } from 'react-hook-form';
import { Series } from '@prisma/client';
import React from 'react';
import Info from './info';
import Ocr from './ocr';
import Images from './images';
import UploadButton from './uploadButton';
import type { FormChild, VolumeFields } from './types';

export default function VolumeInfo({
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
      <Ocr register={register} watch={watch} errors={errors} />
      <div className="divider" />
      <Images register={register} watch={watch} errors={errors} />
      <div className="divider" />
      <UploadButton>Upload Volume</UploadButton>
    </>
  );
}
