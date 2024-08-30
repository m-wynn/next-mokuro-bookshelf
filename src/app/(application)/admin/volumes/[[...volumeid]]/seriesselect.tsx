'use client';

import { Series } from '@prisma/client';
import { UseFormSetValue } from 'react-hook-form';
import type { FormChild, VolumeFields } from './types';

export default function SeriesSelect({
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
  );
}
