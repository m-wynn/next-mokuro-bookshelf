"use client";
import { useEffect } from "react";
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

export default function VolumeEditor({ params: { volumeid } }): JSX.Element {
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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Submitting");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("volumeNumber", data.volumeNumber.toString());
    formData.append("coverImage", data.coverImage[0]);

    fetch("/api/volume", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((volume) => {
        Array.from(data.pages).forEach((page, i) => {
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
          fetch("/api/page", {
            method: "POST",
            body: pageFormData,
          }).then((response) => {
            console.log(response);
          });
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Info register={register} watch={watch} errors={errors} />
      <div className="divider"></div>
      <Ocr register={register} watch={watch} errors={errors} />
      <div className="divider"></div>
      <Images register={register} watch={watch} errors={errors} />
    </form>
  );
}
