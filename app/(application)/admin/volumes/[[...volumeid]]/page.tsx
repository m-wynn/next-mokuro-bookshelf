"use client";
import { useEffect, useState } from "react";
import Info from "./info";
import Ocr from "./ocr";
import Images from "./images";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  title: string;
  volumeNumber: number;
  coverImage: FileList;
  ocrFiles: FileList;
  pages: FileList;
};

export default function VolumeEditor({ params: { volumeid } }) {
  const [uploadedPages, setUploadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (volumeid) {
      alert("wow there is a query");
    }
  }, [volumeid]);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setTotalPages(data.pages.length);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("volumeNumber", data.volumeNumber.toString());
    formData.append("coverImage", data.coverImage[0]);

    const response = await fetch("/api/volume", {
      method: "POST",
      body: formData,
    });
    const volume = await response.json();
    await Promise.all(
      Array.from(data.pages).map(async (page, i) => {
        const pageFormData = new FormData();
        pageFormData.append("volumeId", volume.id);
        pageFormData.append("number", i.toString());
        pageFormData.append("file", page);
        pageFormData.append(
          "ocr",
          Array.from(data.ocrFiles).find(
            (ocrFile) =>
              ocrFile.name === page.name.replace(/\.[^/.]+$/, "") + ".json",
          ) as Blob,
        );
        await fetch("/api/page", {
          method: "POST",
          body: pageFormData,
        });
        setUploadedPages(i + 1);
      }),
    );
    alert("Done!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Info register={register} watch={watch} errors={errors} />
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
  );
}
