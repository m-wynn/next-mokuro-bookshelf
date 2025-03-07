/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */

'use client';

import {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { SeriesInputs } from 'series';
import { Series } from '@prisma/client';
import { PromisePool } from '@supercharge/promise-pool';
import NewSeriesModal from '@/NewSeriesModal';
import ConfirmDenyModal from '@/ConfirmDenyModal';
import { useAdminContext } from '../../AdminContext';
import DirectoryInfo from './directoryInfo';
import VolumeInfo from './volumeInfo';
import {
  createEpubVolume, createSeries, createVolume, updateExistingReadingsAfterUpload,
} from '../../functions';
import {
  VolumeData, PageData, PageUploadData, VolumeFields,
  EpubData,
} from './types';
import { getDirectoryVolumeData, validateVolumeData, getSingleVolumeData } from './utils';
import EpubInfo from './epubInfo';

export default function VolumeEditor({
  params: { _volumeid },
}: {
  params: { _volumeid: string | null };
}) {
  const { series, setSeries } = useAdminContext();
  const [uploadedPages, setUploadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [uploadMode, setUploadMode] = useState<'volume' | 'directory' | 'epub'>('volume');
  const [firstPageIsCoverDict, setFirstPageIsCoverDict] = useState<object>({});

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VolumeFields>();

  const getSeriesId = useCallback((englishName: string): number => {
    const seriesId = series.find((s) => s.englishName === englishName)?.id;
    if (!seriesId) {
      throw new Error('Series not found');
    }
    return seriesId;
  }, [series]);

  const seriesEnglishName = watch('seriesEnglishName');
  const directory = watch('directory');

  const volumeDataForPreview = useMemo(() => {
    const fileCount = directory?.length || 0;
    if (!['Manga Series', 'Add New'].includes(seriesEnglishName) && fileCount > 0) {
      const seriesId = getSeriesId(seriesEnglishName);
      return getDirectoryVolumeData(seriesId, directory, firstPageIsCoverDict);
    }
    return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSeriesId, seriesEnglishName, directory]);

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
        pageFormData.append('file', page as Blob);
        pageFormData.append('ocr', ocr as Blob);

        // Allow for up to 20 seconds to pass before timing out
        await fetchWithTimeout('/api/page', 20000, {
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
    formData.append('coverImage', volumeData.coverPage as Blob);
    formData.append('firstPageIsCover', volumeData.firstPageIsCover ? 'true' : 'false');
    const volume = await createVolume(formData);

    let pageUploadData = {
      pagesToUpload: volumeData.pages,
      uploadsSoFar,
    };

    while (pageUploadData.pagesToUpload.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      pageUploadData = await uploadPages(pageUploadData, volume.id);
    }
    await updateExistingReadingsAfterUpload(volume.id);
  };

  const uploadEpub = async (epubData: EpubData) => {
    const formData = new FormData();
    formData.append('seriesId', epubData.seriesId.toString());
    formData.append('volumeNumber', epubData.volumeNumber.toString());
    formData.append('coverImage', epubData.coverPage as Blob);
    formData.append('epub', epubData.epub as Blob);
    await createEpubVolume(formData);
  };

  const onVolumeSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    const seriesId = getSeriesId(data.seriesEnglishName);
    const volume = getSingleVolumeData(seriesId, data);

    setUploadedPages(0);
    setTotalPages(data.pages.length);
    await uploadVolume(volume);

    // eslint-disable-next-line no-alert
    alert('Done!');
  };

  const onDirectorySubmit: SubmitHandler<FieldValues> = async (data) => {
    const seriesId = getSeriesId(data.seriesEnglishName);
    const volumes = getDirectoryVolumeData(seriesId, data.directory, firstPageIsCoverDict);
    const totalPagesForAllVolumes = volumes.reduce((acc, volume) => acc + volume.pages.length, 0);
    let uploadsSoFar = 0;

    setUploadedPages(0);
    setTotalPages(totalPagesForAllVolumes);
    for (let i = 0; i < volumes.length; i += 1) {
      const volume = volumes[i];
      // eslint-disable-next-line no-await-in-loop
      await uploadVolume(volume, uploadsSoFar);
      uploadsSoFar += volume.pages.length;
    }

    // eslint-disable-next-line no-alert
    alert('Done!');
  };

  const onEpubSubmit: SubmitHandler<FieldValues> = async (data) => {
    const seriesId = getSeriesId(data.seriesEnglishName);
    await uploadEpub({
      seriesId,
      volumeNumber: data.volumeNumber,
      coverPage: data.coverImage[0],
      epub: data.epub[0],
    });
    // eslint-disable-next-line no-alert
    alert('Done!');
  };

  const newSeriesModalRef: React.RefObject<HTMLDialogElement> = useRef(null);
  const errorModalRef: React.RefObject<HTMLDialogElement> = useRef(null);

  const createSeriesHandler = async (data: SeriesInputs) => {
    const newSeries = await createSeries(data);
    setSeries((prev: Series[]) => [...prev, newSeries]);
    newSeriesModalRef.current?.close();
    // For some reason setting a timeout here fixes the issue where the select
    // doesn't update to the new series, but instead goes to index 0
    setTimeout(() => setValue('seriesEnglishName', newSeries.englishName), 100);
  };

  const submitForm = () => {
    errorModalRef.current?.close();
    switch (uploadMode) {
      case 'volume':
        handleSubmit(onVolumeSubmit)();
        break;
      case 'directory':
        handleSubmit(onDirectorySubmit)();
        break;
      case 'epub':
        handleSubmit(onEpubSubmit)();
        break;
      default:
        break;
    }
  };

  const validateFormAndSubmit = (data: FieldValues) => {
    let isDataValid = false;
    const seriesId = getSeriesId(data.seriesEnglishName);
    if (uploadMode === 'volume') {
      const volume = getSingleVolumeData(seriesId, data);
      isDataValid = validateVolumeData(volume);
    } else if (uploadMode === 'directory') {
      const volumes = getDirectoryVolumeData(seriesId, data.directory, firstPageIsCoverDict);
      isDataValid = volumes.reduce((valid, volume) => (
        valid && validateVolumeData(volume)
      ), true);
    } else if (uploadMode === 'epub') {
      isDataValid = true;
    }

    if (!isDataValid) {
      errorModalRef.current?.show();
      return;
    }
    submitForm();
  };

  return (
    <>
      <NewSeriesModal
        dialogRef={newSeriesModalRef}
        createSeries={createSeriesHandler}
      />
      <ConfirmDenyModal
        header="Missing volume data!"
        message="Some volumes are missing data. Are you SURE you want to continue with this upload?"
        dialogRef={errorModalRef}
        callback={(accepted) => {
          errorModalRef.current?.close();
          if (accepted) {
            submitForm();
          }
        }}
      />
      <label className="cursor-pointer label">
        <span className="label-text">Upload mode</span>
        <select className="select select-bordered" value={uploadMode} onChange={(e) => setUploadMode(e.target.value as 'volume' | 'directory' | 'epub')}>
          <option value="volume">Volume</option>
          <option value="directory">Directory</option>
          <option value="epub">Epub</option>
        </select>
      </label>
      <form onSubmit={handleSubmit(validateFormAndSubmit)}>
        {uploadMode === 'directory' ? (
          <DirectoryInfo
            newSeriesModalRef={newSeriesModalRef}
            register={register}
            series={series}
            setValue={setValue}
            volumeData={volumeDataForPreview}
            setFirstPageIsCoverDict={setFirstPageIsCoverDict}
          />
        ) : uploadMode === 'volume' ? (
          <VolumeInfo
            newSeriesModalRef={newSeriesModalRef}
            register={register}
            watch={watch}
            errors={errors}
            series={series}
            setValue={setValue}
          />
        ) : uploadMode === 'epub' ? (
          <EpubInfo
            errors={errors}
            setValue={setValue}
            register={register}
            watch={watch}
            series={series}
            newSeriesModalRef={newSeriesModalRef}
          />
        ) : null}
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
}
