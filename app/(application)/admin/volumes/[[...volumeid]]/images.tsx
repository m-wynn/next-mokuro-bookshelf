import { useEffect } from "react";
import Input from "@/input";
import { FormChild } from "./page";
import { FieldValues } from "react-hook-form";

export default function Images({
  register,
  watch,
  errors,
}: FormChild): JSX.Element {
  const pages: FileList = watch("pages");
  const ocrText = watch("ocrText");
  useEffect(() => {}, [pages, ocrText]);

  return (
    <div className="card bg-base-300 rounded-box">
      <div className="items-center card-body">
        <h2 className="card-title">Upload Pages</h2>
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col justify-between items-center w-1/2">
            <div className="w-full max-w-xs">
              <label className="flex cursor-pointer label justify-normal">
                <span className="mr-3 label-text">First page is cover</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("firstPageIsCover", {})}
                />
              </label>
            </div>
            <Input
              label="Image Files"
              type="file"
              extraProperties={{ accept: "image/*", multiple: true }}
              classNameOverride={`w-full max-w-xs file-input file-input-bordered ${
                errors?.pages && "file-input-error"
              }`}
              errors={errors?.pages || null}
              register={register("pages", {
                required: "Images are required",
                validate: {
                  validateNumber: (_: any, values: FieldValues) => {
                    if (values && ocrText) {
                      // check that pages' filenames and ocrtext's keys match
                      const ocrTextKeys = Object.keys(ocrText);
                      const pagesFilenames = Array.from(values as FileList).map(
                        (page) => page.name.replace(/\.[^/.]+$/, ""),
                      );
                      const mismatch = ocrTextKeys.reduce(
                        (acc: string[], filename) =>
                          pagesFilenames.includes(
                            filename.replace(/\.[^/.]+$/, ""),
                          )
                            ? acc
                            : [...acc, filename],
                        [],
                      );

                      if (mismatch.length > 0) {
                        return `Missing OCR text for ${
                          mismatch.length > 3
                            ? `${mismatch.length} pages`
                            : mismatch.join(", ")
                        }`;
                      } else {
                        return "Image files match OCR files";
                      }
                    }
                  },
                },
              })}
            />
          </div>
          <div className="flex flex-col-reverse items-center w-1/2">
            <button type="submit" className="w-full btn btn-primary">
              Upload Volume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
