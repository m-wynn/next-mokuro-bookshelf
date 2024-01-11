import { useEffect, useState } from 'react';
import Input from '@/input';
import type { OcrPage } from 'page';
import type { FormChild } from './types';

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}

export default function Ocr({
  errors,
  register,
  watch,
}: FormChild): JSX.Element {
  const [ocrText, setOcrText] = useState<{ string: OcrPage } | {}>({});

  const volumeNumber = watch('volumeNumber');
  const ocrFiles = watch('ocrFiles');

  useEffect(() => {
    const parseFiles = async (files: FileList) => {
      const fileMap = (
        await Promise.all(
          Array.from(files).map(async (ocrFile) => ({
            [ocrFile.name]: JSON.parse((await readFile(ocrFile)) as string),
          })),
        )
      ).reduce((acc, currentFile) => ({ ...acc, ...currentFile }), {});
      setOcrText(fileMap as { string: OcrPage });
    };
    if (ocrFiles && ocrFiles.length > 0) {
      parseFiles(ocrFiles);
    }
  }, [ocrFiles]);

  return (
    <div className="card bg-base-300 rounded-box">
      <div className="items-center card-body">
        <h2 className="card-title">OCR Files</h2>
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col justify-between items-center w-1/2">
            <Input
              label="OCR Files"
              type="file"
              extraProperties={{ accept: 'application/json', multiple: true }}
              classNameOverride={`w-full max-w-xs file-input file-input-bordered ${
                errors?.ocrFiles && 'file-input-error'
              }`}
              errors={errors?.coverImage || null}
              register={register('ocrFiles', {
                required: 'OCR Files are required',
              })}
            />
            <div className="my-4 w-full max-w-xs text-center shadow stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Pages</div>
                <div className="stat-value">{Object.keys(ocrText).length}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Text Blocks</div>
                <div className="stat-value">
                  {Object.values(ocrText)
                    .map((page) => page.blocks.length)
                    .reduce((acc, item) => acc + item, 0)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse items-center w-1/2">
            <div className="my-4 w-full max-w-xs mockup-code bg-base-100">
              <pre data-prefix="$">
                <code>pip3 install mokuro</code>
              </pre>
              <pre data-prefix="$">
                <code>
                  mokuro &quot;./Volume
                  {volumeNumber}
                  &quot;
                </code>
              </pre>
              <pre data-prefix="$">
                <code>
                  ls &quot;_ocr/Volume
                  {volumeNumber}
                  &quot;
                </code>
              </pre>
              <pre className="text-warning">
                <code>./001.json ./002.json ...</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
