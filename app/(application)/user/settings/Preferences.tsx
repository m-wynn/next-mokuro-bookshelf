'use client';

import React from 'react';
import {
  faTableColumns,
  faMagnifyingGlass,
  faYenSign,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Checkbox from '@/checkbox';
import type { UserSetting } from 'lib/userSetting';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import {
  updateUseTwoPages,
  updateZoomSensitivity,
  updateUseJapaneseTitle,
  updateShowNsfwContent,
} from './functions';

export default function Preferences() {
  const { userSettings, setUserSettings } = useGlobalContext();
  const setUserSetting = (setting: any) => {
    setUserSettings((original: UserSetting) => ({
      ...original,
      ...setting,
    }));
  };

  return (
    <div className="flex flex-col mt-4 w-96 max-w-2xl md:w-1/2 grow">
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <span className="text-2xl card-title">Preferences</span>
          <div className="w-full">
            <span className="text-xl font-bold">Reader</span>
            <Checkbox
              fa={faTableColumns}
              value={userSettings?.useTwoPages || false}
              set={(checked) => {
                updateUseTwoPages(checked);
                setUserSetting({ useTwoPages: checked });
              }}
            >
              Display Two Pages
            </Checkbox>
            <label className="flex-row w-full cursor-pointer label">
              <span className="flex-grow label-text">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-4" />
                Zoom Sensitivity
              </span>
              <select
                className="select"
                defaultValue={userSettings?.zoomSensitivity}
                onChange={(e) => {
                  const sensitivity = +e.target.value;
                  updateZoomSensitivity(sensitivity);
                  setUserSetting({ zoomSensitivity: sensitivity });
                }}
              >
                {[...Array(10).keys()].map((sensitivity) => (
                  <option key={sensitivity + 1}>{sensitivity + 1}</option>
                ))}
              </select>
            </label>
            <hr className="mt-4 mb-4 opacity-30" />
            <span className="text-xl font-bold">General</span>
            <Checkbox
              fa={faYenSign}
              value={userSettings?.useJapaneseTitle || false}
              set={(checked) => {
                updateUseJapaneseTitle(checked);
                setUserSetting({ useJapaneseTitle: checked });
              }}
            >
              Show Japanese Title
            </Checkbox>
            <Checkbox
              fa={faBan}
              value={userSettings?.showNsfwContent || false}
              set={(checked) => {
                updateShowNsfwContent(checked);
                setUserSetting({ showNsfwContent: checked });
              }}
            >
              Show NSFW Content
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
}
