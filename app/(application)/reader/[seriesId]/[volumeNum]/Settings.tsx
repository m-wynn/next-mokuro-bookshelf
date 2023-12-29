import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBook,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";

const setVolumeSetting = (volumeId, setCallback, settingKey, value) => {
  fetch(`/api/volumeSetting/${volumeId}`, {
    method: "POST",
    body: JSON.stringify({ [settingKey]: value }),
  });
  setCallback(value);
}

export default function Settings({
  volumeId,
  useTwoPages,
  setUseTwoPages,
  firstPageIsCover,
  setFirstPageIsCover,
}) {
  return (
    <details className="dropdown dropdown-end join-item">
      <summary role="button" className="btn btn-square">
        <FontAwesomeIcon role="button" icon={faBars} />
      </summary>
      <ul className="p-2 mt-4 w-64 shadow menu dropdown-content z-[1] bg-base-300 rounded-box">
        <Checkbox
          fa={faTableColumns}
          value={useTwoPages}
          set={(checked) => { setVolumeSetting(volumeId, setUseTwoPages, 'useTwoPagesOverride', checked) }}
        >
          Display Two Pages
        </Checkbox>
        <Checkbox
          fa={faBook}
          value={firstPageIsCover}
          set={(checked) => { setVolumeSetting(volumeId, setFirstPageIsCover, 'firstPageIsCoverOverride', checked) }}
        >
          First Page Is Cover
        </Checkbox>
      </ul>
    </details>
  );
}

const Checkbox = ({ children, fa, value, set }) => {
  return (
    <li>
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
    </li>
  );
};
