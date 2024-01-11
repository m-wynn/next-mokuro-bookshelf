import Info from './info';
import Ocr from './ocr';
import Images from './images';

export default function VolumeInfo({
  errors,
  setValue,
  register,
  watch,
  series,
  newSeriesModalRef
}: {
  errors: FormChild['errors'];
  setValue: UseFormSetValue<VolumeFields>;
  register: FormChild['register'];
  watch: FormChild['watch'];
  series: Series[];
  newSeriesModalRef: React.RefObject<HTMLDialogElement>;
}): JSX.Element {
  return (
    <>
      <Info
        newSeriesModalRef={newSeriesModalRef}
        register={register}
        watch={watch}
        errors={errors}
        series={series}
        setValue={setValue}
      />
      <div className="divider" />
      <Ocr register={register} watch={watch} errors={errors} />
      <div className="divider" />
      <Images register={register} watch={watch} errors={errors} />
      <div className="flex flex-col-reverse items-center w-1/2">
        <button type="submit" className="w-full btn btn-primary">
          Upload Volume
        </button>
      </div>
    </>
  );
};
