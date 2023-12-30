import {
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";
export default function Input({
  label,
  errors,
  register,
  placeholder,
  defaultValue,
  extraProperties = {},
  classNameOverride,
  type = "text",
}: {
  label: string;
  errors: FieldError | Merge<FieldErrors, FieldErrorsImpl<any>> | null;
  register: UseFormRegisterReturn<string>;
  placeholder?: string;
  extraProperties?: { [key: string]: string | boolean };
  defaultValue?: string;
  classNameOverride?: string;
  type?: string;
}): JSX.Element {
  return (
    <div className="w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        {...extraProperties}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={
          classNameOverride != null
            ? classNameOverride
            : `w-full input input-bordered input-lg ${
                errors ? "input-error" : ""
              }`
        }
        {...register}
      />
      {errors && (
        <label className="label label-text-alt text-error">
          {errors?.message as string}
        </label>
      )}
    </div>
  );
}
