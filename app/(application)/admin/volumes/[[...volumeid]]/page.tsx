"use client";
import { useEffect, useRef, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { useAdminContext } from "../../AdminContext";
import Images from "./images";
import Info from "./info";
import Ocr from "./ocr";
import NewSeriesModal from "@/NewSeriesModal";
import { createSeries, createVolume, createPage } from "../../functions";
import { SeriesInputs } from "series";
import { Series } from "@prisma/client";

export type FormChild = {
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export type VolumeFields = {
  seriesId: string;
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
      alert("Editing is not supported");
    }
  }, [volumeid]);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VolumeFields>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setTotalPages(data.pages.length);
    const formData = new FormData();
    formData.append("seriesId", data.seriesId);
    formData.append("volumeNumber", data.volumeNumber.toString());
    formData.append("coverImage", data.coverImage[0]);
    formData.append("firstPageIsCover", data.firstPageIsCover);

    const response = await fetch("/api/volume", {
      method: "POST",
      body: formData,
    });
    const volume = await response.json();
    let uploadedPageCount = 0;
    await Promise.all(
      Array.from(data.pages as FileList).map(async (page, i) => {
        const pageFormData = new FormData();
        pageFormData.append("volumeId", volume.id);
        pageFormData.append("number", i.toString());
        pageFormData.append("file", page);
        pageFormData.append(
          "ocr",
          Array.from(data.ocrFiles as FileList).find(
            (ocrFile) =>
              ocrFile.name ===
              (page as File).name.replace(/\.[^/.]+$/, "") + ".json",
          ) as Blob,
        );
        await fetch("/api/page", {
          method: "POST",
          body: pageFormData,
        });
        uploadedPageCount++;
        setUploadedPages(uploadedPageCount);
      }),
    );
    alert("Done!");
  };
  const newSeriesModalRef: React.RefObject<HTMLDialogElement> = useRef(null);

  const createSeriesHandler = async (data: SeriesInputs) => {
    const newSeries = await createSeries(data);
    setSeries((prev: Series[]) => [...prev, newSeries]);
    setValue("seriesId", newSeries.id);
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
        <div className="divider"></div>
        <Ocr register={register} watch={watch} errors={errors} />
        <div className="divider"></div>
        <Images register={register} watch={watch} errors={errors} />
        {totalPages > 0 && (
          <progress
            className="progress progress-accent"
            value={uploadedPages}
            max={totalPages}
          ></progress>
        )}
      </form>
    </>
  );
}
