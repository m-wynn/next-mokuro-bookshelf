import VolumeCard from "@/volumecard";
import { useEffect, useState } from "react";
type BasicInfoProps = {
  onNext: () => void;
  title: string;
  setTitle: (title: string) => void;
  volumeNumber: number;
  setVolumeNumber: (volumeNumber: number) => void;
  coverFile: File | undefined;
  setCoverFile: (coverFile: File) => void;
};
export default function BasicInfo({
  onNext,
  title,
  setTitle,
  volumeNumber,
  setVolumeNumber,
  coverFile,
  setCoverFile,
}: BasicInfoProps): JSX.Element {
  const [coverUri, setCoverUri] = useState("");
  useEffect(() => {
    if (coverFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setCoverUri(e.target.result);
        }
      };
      reader.readAsDataURL(coverFile);
    }
  }, [coverFile]);
  return (
    <div className="flex flex-row justify-around grow">
      <form>
        <label className="label">
          <span className="label-text">Manga Title</span>
        </label>
        <input
          type="text"
          placeholder="Non Non Biyori"
          className="w-full max-w-xs input input-bordered input-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="label">
          <span className="label-text">Volume Number</span>
        </label>
        <input
          type="number"
          className="w-full max-w-xs input input-bordered input-lg"
          value={volumeNumber}
          onChange={(e) => setVolumeNumber(parseInt(e.target.value))}
        />
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">Cover Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full max-w-xs file-input file-input-bordered"
            onChange={(e) => e.target.files && setCoverFile(e.target.files[0])}
          />
          <label className="label"></label>
        </div>
        <div className="w-full max-w-xs form-control">
          <button className="btn" value="Upload" onClick={onNext}>
            Next
          </button>
        </div>
      </form>
      <VolumeCard
        coverUri={coverUri == "" ? "https://placekitten.com/400/540" : coverUri}
        href="#"
        bookName={title == "" ? "Manga Title" : title}
        volumeNumber={volumeNumber}
      />
    </div>
  );
}
