import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBook,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@/checkbox";

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
        <li>
          <Checkbox
            fa={faTableColumns}
            value={useTwoPages}
            set={(checked) => { setVolumeSetting(volumeId, setUseTwoPages, 'useTwoPagesOverride', checked) }}
          >
            Display Two Pages
          </Checkbox>
        </li>
        <li>
          <Checkbox
            fa={faBook}
            value={firstPageIsCover}
            set={(checked) => { setVolumeSetting(volumeId, setFirstPageIsCover, 'firstPageIsCoverOverride', checked) }}
          >
            First Page Is Cover
          </Checkbox>
        </li>
      </ul>
    </details>
  );
}
