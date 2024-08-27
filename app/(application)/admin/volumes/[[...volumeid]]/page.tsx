'use client';

<<<<<<< Updated upstream
import {
  useCallback, useMemo, useRef, useState,
} from 'react';
=======
import { useEffect, useRef, useState } from 'react';
>>>>>>> Stashed changes
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import NewSeriesModal from '@/NewSeriesModal';
import { SeriesInputs } from 'series';
import { Series } from '@prisma/client';
<<<<<<< Updated upstream
import { PromisePool } from '@supercharge/promise-pool';
import ConfirmDenyModal from '@/ConfirmDenyModal';
import { useAdminContext } from '../../AdminContext';
import DirectoryInfo from './directoryInfo';
import VolumeInfo from './volumeInfo';
import { createSeries, createVolume } from '../../functions';
import {
  VolumeData, PageData, PageUploadData, VolumeFields,
} from './types';
import { getDirectoryVolumeData, validateVolumeData, getSingleVolumeData } from './utils';
=======
import PromisePool from 'async-promise-pool';
import { useAdminContext } from '../../AdminContext';
import Images from './images';
import Info from './info';
import Ocr from './ocr';
import { createSeries, createVolume, createPage } from '../../functions';

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
>>>>>>> Stashed changes

export default function VolumeEditor({
  params: { _volumeid },
}: {
  params: { _volumeid: string | null };
}) {
  const { series, setSeries } = useAdminContext();
  const [uploadedPages, setUploadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDirectoryUpload, setIsDirectoryUpload] = useState(false);
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
<<<<<<< Updated upstream
        pageFormData.append('volumeId', volumeId.toString());
        pageFormData.append('number', index.toString());
        pageFormData.append('file', page as Blob);
        pageFormData.append('ocr', ocr as Blob);

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
  };

  const onVolumeSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    const seriesId = getSeriesId(data.seriesEnglishName);
    const volume = getSingleVolumeData(seriesId, data);

    setUploadedPages(0);
    setTotalPages(data.pages.length);
    await uploadVolume(volume);

    // eslint-disable-next-line no-alert
=======
        pageFormData.append('volumeId', volume.id.toString());
        pageFormData.append('number', i.toString());
        pageFormData.append('file', page);
        pageFormData.append(
          'ocr',
          Array.from(data.ocrFiles as FileList).find(
            (ocrFile) => ocrFile.name
              === `${(page as File).name.replace(/\.[^/.]+$/, '')}.json`,
          ) as Blob,
        );
        await createPage(pageFormData);
        uploadedPageCount++;
        setUploadedPages(uploadedPageCount);
      })
      .forEach((task) => pool.add(() => task));
    await pool.all();
>>>>>>> Stashed changes
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
    handleSubmit(isDirectoryUpload ? onDirectorySubmit : onVolumeSubmit)();
  };

  const validateFormAndSubmit = (data: FieldValues) => {
    let isDataValid = false;
    const seriesId = getSeriesId(data.seriesEnglishName);
    if (isDirectoryUpload) {
      const volumes = getDirectoryVolumeData(seriesId, data.directory, firstPageIsCoverDict);
      isDataValid = volumes.reduce((valid, volume) => (
        valid && validateVolumeData(volume)
      ), true);
    } else {
      const volume = getSingleVolumeData(seriesId, data);
      isDataValid = validateVolumeData(volume);
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
        <span className="label-text">Directory Upload</span>
        <input
          type="checkbox"
          className="toggle"
          checked={isDirectoryUpload}
          onChange={(_e) => { setIsDirectoryUpload(!isDirectoryUpload); }}
        />
<<<<<<< Updated upstream
      </label>
      <form onSubmit={handleSubmit(validateFormAndSubmit)}>
        { isDirectoryUpload
          ? (
            <DirectoryInfo
              newSeriesModalRef={newSeriesModalRef}
              register={register}
              series={series}
              setValue={setValue}
              volumeData={volumeDataForPreview}
              setFirstPageIsCoverDict={setFirstPageIsCoverDict}
            />
          ) : (
            <VolumeInfo
              newSeriesModalRef={newSeriesModalRef}
              register={register}
              watch={watch}
              errors={errors}
              series={series}
              setValue={setValue}
            />
          )}
=======
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
>>>>>>> Stashed changes
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
