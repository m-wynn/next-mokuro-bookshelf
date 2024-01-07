'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import NewSeriesModal from '@/NewSeriesModal';
import { SeriesInputs } from 'series';
import { Series } from '@prisma/client';
import { PromisePool } from '@supercharge/promise-pool';
import { useAdminContext } from '../../AdminContext';
import Images from './images';
import Info from './info';
import Ocr from './ocr';
import { createSeries, createVolume } from '../../functions';

type PageData = {
  page: Blob;
  ocr: Blob;
  index: number;
};

type PageUploadData = {
  pagesToUpload: PageData[];
  uploadsSoFar: number;
};

export type FormChild = {
  errors: FieldErrors<VolumeFields>;
  register: UseFormRegister<VolumeFields>;
  watch: UseFormWatch<VolumeFields>;
};

export type VolumeFields = {
  seriesEnglishName: string;
  volumeNumber: number;
  coverImage: FileList;
  firstPageIsCover: boolean;
  pages: FileList;
  ocrFiles: FileList;
};

export default function VolumeEditor({
  params: { volumeid },
}: {
  params: { volumeid: string | null };
}) {
  const { series, setSeries } = useAdminContext();
  const [uploadedPages, setUploadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (volumeid) {
      // TODO: Move this file if we're not gonna support editing
      // eslint-disable-next-line no-console
      console.log('volumeid', volumeid);
    }
  }, [volumeid]);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VolumeFields>();

  const fetchWithTimeout = async (uri: string, timeout: number, data: any) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return fetch(uri, {
      signal: controller.signal,
      ...data,
    }).then((response) => {
      clearTimeout(timeoutId);
      return response;
    });
  };

  const uploadPages: (
    pageUploadData: PageUploadData,
    volumeId: number
  ) => Promise<PageUploadData> = async (pageUploadData, volumeId) => {
    const failedPages: PageData[] = [];
    let { uploadsSoFar } = pageUploadData;
    const { pagesToUpload } = pageUploadData;

    await PromisePool
      .withConcurrency(5)
      .for(pagesToUpload)
      .process(async (pageData: PageData) => {
        const { page, ocr, index } = pageData;
        const pageFormData = new FormData();
        pageFormData.append('volumeId', volumeId.toString());
        pageFormData.append('number', index.toString());
        pageFormData.append('file', page);
        pageFormData.append('ocr', ocr);

        await fetchWithTimeout('/api/page', 5000, {
          method: 'POST',
          body: pageFormData,
        }).then((response) => {
          if (!response.ok) {
            throw new Error('page upload failed');
          }
          uploadsSoFar += 1;
          setUploadedPages(uploadsSoFar);
        }).catch(() => {
          failedPages.push(pageData);
        });
      });

    return {
      pagesToUpload: failedPages,
      uploadsSoFar,
    };
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const seriesId = series.find(
      (s) => s.englishName === data.seriesEnglishName,
    )?.id;
    if (!seriesId) {
      throw new Error('Series not found');
    }

    setUploadedPages(0);
    setTotalPages(data.pages.length);

    const formData = new FormData();
    formData.append('seriesId', seriesId.toString());
    formData.append('volumeNumber', data.volumeNumber.toString());
    formData.append('coverImage', data.coverImage[0]);
    formData.append('firstPageIsCover', data.firstPageIsCover);
    const volume = await createVolume(formData);

    const pagesToUpload: PageData[] = Array.from(data.pages).map((page, index) => {
      const ocr = Array.from(data.ocrFiles as FileList).find(
        (ocrFile) => ocrFile.name === `${(page as File).name.replace(/\.[^/.]+$/, '')}.json`,
      ) as Blob;

      return {
        index,
        page,
        ocr,
      } as PageData;
    });

    let pageUploadData = {
      pagesToUpload,
      uploadsSoFar: 0,
    };

    while (pageUploadData.pagesToUpload.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      pageUploadData = await uploadPages(pageUploadData, volume.id);
    }

    // eslint-disable-next-line no-alert
    alert('Done!');
  };
  const newSeriesModalRef: React.RefObject<HTMLDialogElement> = useRef(null);

  const createSeriesHandler = async (data: SeriesInputs) => {
    const newSeries = await createSeries(data);
    setSeries((prev: Series[]) => [...prev, newSeries]);
    newSeriesModalRef.current?.close();
    // For some reason setting a timeout here fixes the issue where the select
    // doesn't update to the new series, but instead goes to index 0
    setTimeout(() => setValue('seriesEnglishName', newSeries.englishName), 100);
  };

  return (
    <>
      <NewSeriesModal
        dialogRef={newSeriesModalRef}
        createSeries={createSeriesHandler}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
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
        {totalPages > 0 && (
          <progress
            className="progress progress-accent"
            value={uploadedPages}
            max={totalPages}
          />
        )}
      </form>
    </>
  );
}
