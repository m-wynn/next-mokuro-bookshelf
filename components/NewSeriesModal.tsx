'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { SeriesInputs } from 'series';
import Input from './input';

function NewSeriesModal({
  dialogRef,
  createSeries,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  createSeries: (data: SeriesInputs) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeriesInputs>();
  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="text-center modal-box">
        <h3 className="text-lg font-bold">Create a new Series</h3>
        <div className="flex-row justify-center modal-action">
          <form onSubmit={handleSubmit(createSeries)}>
            <Input
              label="English Name"
              type="text"
              placeholder="Non Non Biyori"
              errors={errors?.englishName || null}
              register={register('englishName', {
                required: 'English Name is required',
              })}
            />
            <Input
              label="Japanese Name"
              type="text"
              placeholder="のんのんびより"
              errors={errors?.japaneseName || null}
              register={register('japaneseName', {
                required: 'Japanese Name is required',
              })}
            />
            <Input
              label="Is NSFW"
              type="checkbox"
              classNameOverride="checkbox"
              register={register('isNsfw')}
            />
            <button type="submit" className="mt-8 w-full btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default NewSeriesModal;
