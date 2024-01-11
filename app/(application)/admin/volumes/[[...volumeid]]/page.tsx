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
import DirectoryInfo from './directoryInfo';
import VolumeInfo from './volumeInfo';
import Ocr from './ocr';
import { createSeries, createVolume } from '../../functions';
import { SeriesSelect } from './seriesselect';
import { VolumeData, PageData, PageUploadData, VolumeFields } from './types';
import { getOcrFileForPage, getVolumeData } from './utils';

export default function VolumeEditor({
  params: { volumeid },
}: {
  params: { volumeid: string | null };
}) {
  const { series, setSeries } = useAdminContext();
  const [uploadedPages, setUploadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDirectoryUpload, setIsDirectoryUpload] = useState(true);

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

  const uploadVolume = async (volumeData: VolumeData, uploadsSoFar: number = 0) => {
    const formData = new FormData();
    formData.append('seriesId', volumeData.seriesId.toString());
    formData.append('volumeNumber', volumeData.number.toString());
    formData.append('coverImage', volumeData.coverPage);
    formData.append('firstPageIsCover', volumeData.firstPageIsCover);
    const volume = await createVolume(formData);

    let pageUploadData = {
      pagesToUpload: volumeData.pages,
      uploadsSoFar,
    };

    while (pageUploadData.pagesToUpload.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      pageUploadData = await uploadPages(pageUploadData, volume.id);
    }
  }

  const getSeriesId: string = (englishName) => {
    const seriesId = series.find((s) => s.englishName === englishName)?.id;
    if (!seriesId) {
      throw new Error('Series not found');
    }
    return seriesId;
  }

  const onVolumeSubmit: SubmitHandler<FieldValues> = async (data) => {
    const seriesId = getSeriesId(data);
    const ocrFiles = Array.from(data.ocrFiles);
    const pagesToUpload: PageData[] = Array.from(data.pages).map((page, index) => {
      const ocr = getOcrFileForPage(page, ocrFiles);
      return {
        index,
        page,
        ocr,
      } as PageData;
    });

    const volumeData = {
      number: data.volumeNumber,
      coverPage: data.coverImage[0],
      pages: pagesToUpload,
      firstPageIsCover: data.firstPageIsCover,
      seriesId: seriesId,
    } as VolumeData;

    setUploadedPages(0);
    setTotalPages(data.pages.length);
    await uploadVolume(volumeData);

    // eslint-disable-next-line no-alert
    alert('Done!');
  };

  const onDirectorySubmit: SubmitHandler<FieldValues> = async (data) => {
    const seriesId = getSeriesId(data.seriesEnglishName);
    const volumes = getVolumeData(seriesId, data.directory);
    const totalPagesForAllVolumes = volumes.reduce((acc, volume) => acc + volume.pages.length, 0);
    let uploadsSoFar = 0;
    
    setUploadedPages(0);
    setTotalPages(totalPagesForAllVolumes);
    for (const index in volumes) {
      const volume = volumes[index];
      await uploadVolume(volume, uploadsSoFar);
      uploadsSoFar += volume.pages.length;
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
      <input
        type="checkbox"
        className="toggle"
        checked={isDirectoryUpload}
        onChange={(e) => { setIsDirectoryUpload(!isDirectoryUpload); }}
      />
      <form onSubmit={handleSubmit(isDirectoryUpload ? onDirectorySubmit : onVolumeSubmit)}>
        { isDirectoryUpload ?
          <DirectoryInfo
            newSeriesModalRef={newSeriesModalRef}
            register={register}
            watch={watch}
            errors={errors}
            series={series}
            setValue={setValue}
          /> : <VolumeInfo
            newSeriesModalRef={newSeriesModalRef}
            register={register}
            watch={watch}
            errors={errors}
            series={series}
            setValue={setValue}
          />
        }
      </form>
      {totalPages > 0 && (
        <progress
          className="progress progress-accent"
          value={uploadedPages}
          max={totalPages}
        />
      )}
    </>
  );
};
