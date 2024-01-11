import { useEffect } from 'react';
import Input from '@/input';
import type { FormChild, VolumeFields } from './types';

export default function Images({
  register,
  watch,
  errors,
}: FormChild): JSX.Element {
  const pages: FileList = watch('pages');
  const ocrFiles = watch('ocrFiles');
  useEffect(() => {}, [pages, ocrFiles]);

  return (
    <div className="card bg-base-300 rounded-box">
      <div className="items-center card-body">
        <h2 className="card-title">Upload Pages</h2>
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col justify-between items-center w-1/2">
            <div className="w-full max-w-xs">
              <label className="flex cursor-pointer label justify-normal">
                <span
                  className="mr-3 label-text"
                  data-tip="Use this if the last wide page is an odd number"
                >
                  First page is cover
                </span>
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register('firstPageIsCover')}
                />
              </label>
            </div>
            <Input
              label="Image Files"
              type="file"
              extraProperties={{ accept: 'image/*', multiple: true }}
              classNameOverride={`w-full max-w-xs file-input file-input-bordered ${
                errors?.pages && 'file-input-error'
              }`}
              errors={errors?.pages || null}
              register={register('pages', {
                required: 'Images are required',
                validate: {
                  // eslint-disable-next-line consistent-return
                  validateNumber: (_: any, values: VolumeFields) => {
                    if (values.pages && values.ocrFiles) {
                      // check that pages' filenames and ocrtext's keys match
                      const ocrFilenames = Object.values(values.ocrFiles).map(
                        (file) => file.name.replace(/\.[^/.]+$/, ''),
                      );
                      const pagesFilenames = Array.from(values.pages).map(
                        (page) => page.name.replace(/\.[^/.]+$/, ''),
                      );
                      const mismatch = ocrFilenames.filter(
                        (ocr) => !pagesFilenames.includes(ocr),
                      );

                      if (mismatch.length > 0) {
                        return `Missing OCR text for ${
                          mismatch.length > 3
                            ? `${mismatch.length} pages`
                            : mismatch.join(', ')
                        }`;
                      }
                      return true;
                    }
                  },
                },
              })}
            />
          </div>
          <div className="flex flex-col-reverse items-center w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
