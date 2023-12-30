import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Checkbox({ children, fa, value, set }) {
  return (
    <div className="flex form-control">
      <label className="flex-row w-full cursor-pointer label">
        <span className="flex-grow label-text">
          <FontAwesomeIcon icon={fa} className="mr-4" />
          {children}
        </span>
        <input
          type="checkbox"
          checked={value}
          className="checkbox"
          onChange={(e) => set(e.target.checked)}
        />
      </label>
    </div>
  );
};
