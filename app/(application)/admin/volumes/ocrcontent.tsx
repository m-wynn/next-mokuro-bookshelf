import VolumeCard from "@/volumecard";
import { useEffect, useState } from "react";
type OcrContentProps = {
  onNext: () => void;
  title: string;
  volumeNumber: number;
  ocrText: string;
  setOcrText: (ocrText: string) => void;
};
export default function OcrContent({
  ocrText,
  setOcrText,
  volumeNumber,
}: OcrContentProps): JSX.Element {
  const [ocrFiles, setOcrFiles] = useState<FileList>();
  useEffect(() => {
    const parseFiles = async (ocrFiles: FileList) => {
      Array.from(ocrFiles).map((ocrFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") {
            setOcrText(e.target.result);
          }
        };
        reader.readAsText(ocrFile);
      });
    };

    if (ocrFiles) {
      parseFiles(ocrFiles);
    }
  }, [ocrFiles, setOcrText]);
  return (
    <div className="flex flex-row justify-around grow">
      <div>
        <div className="mockup-code">
          <pre data-prefix="1">
            <code>pip3 install mokuro</code>
          </pre>
          <pre data-prefix="2">
            <code>mokuro "./Volume {volumeNumber}"</code>
          </pre>
          <pre data-prefix="3" className="bg-warning text-success-content">
            <code>ls _ocr</code>
          </pre>
        </div>
      </div>
      <form>
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">OCR Files</span>
          </label>
          <input
            type="file"
            accept="application/json"
            multiple
            className="w-full max-w-xs file-input file-input-bordered"
            onChange={(e) => e.target.files && setOcrFiles(e.target.files)}
          />
        </div>
      </form>
    </div>
  );
}
