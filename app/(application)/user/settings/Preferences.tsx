"use client";
import { useState } from "react";
import React from "react";
import { updateUseTwoPages, updateZoomSensitivity } from "./functions";
import { faTableColumns, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "@/checkbox";
import Input from "@/input";
import { UserSetting } from "lib/userSetting";

export default function Preferences({
  user,
}: {
  user: { userSetting: UserSetting | null };
}) {
  const [useTwoPages, setUseTwoPages] = useState(user.userSetting?.useTwoPages ?? false);
  const [zoomSensitivity, setZoomSensitivity] = useState(user.userSetting?.zoomSensitivity ?? 1);

  return (
    <div className="flex flex-col mt-4 w-96 max-w-2xl md:w-1/2 grow">
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-title">Preferences</h2>
          <div className="w-full">
            <Checkbox
              fa={faTableColumns}
              value={useTwoPages || false}
              set={(checked) => {
                updateUseTwoPages(checked);
                setUseTwoPages(checked);
              }}
            >
              Display Two Pages
            </Checkbox>
            <label className="flex-row w-full cursor-pointer label">
              <span className="flex-grow label-text">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-4" />
                Zoom sensitivity
              </span>
              <select
                className="select"
                defaultValue={zoomSensitivity}
                onChange={(e) => {
                  const sensitivity = parseInt(e.target.value);
                  updateZoomSensitivity(sensitivity);
                  setZoomSensitivity(sensitivity);
                }}
              >
                {[...Array(10).keys()].map((sensitivity) => (
                  <option key={sensitivity + 1}>{sensitivity + 1}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
