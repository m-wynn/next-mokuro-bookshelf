'use client';

<<<<<<< Updated upstream
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> Stashed changes
import {
  faTableColumns,
  faMagnifyingGlass,
  faYenSign,
  faBan,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import Checkbox from '@/checkbox';
<<<<<<< Updated upstream
import FormInput from '@/FormInput';
import type { UserSetting } from 'lib/userSetting';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import {
  updateUserPreference,
=======
import { UserSetting } from 'lib/userSetting';
import {
  updateUseTwoPages,
  updateZoomSensitivity,
  updateUseJapaneseTitle,
>>>>>>> Stashed changes
} from './functions';

export default function Preferences() {
  const { userSettings, setUserSettings } = useGlobalContext();
  const setUserSetting = (setting: any) => {
    updateUserPreference(setting);
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
            <div className="flex form-control">
              <Tooltip id="my-tooltip" place="right">
                <div>You can use the following variables:</div>
                <div>{'{seriesTitle} - Series title'}</div>
                <div>{'{volumeNumber} - Volume number'}</div>
                <div>{'{currentPage} - Current page. Formatted like 10,11 if showing two pages'}</div>
                <div>{'{localizedVolumeNumber} - Localized volume number (ENG or JP)'}</div>
                <div>{'{seriesShortTitle} - Shortened series title (2-4 characters)'}</div>
              </Tooltip>
              <label className="flex-row w-full cursor-pointer label" data-tooltip-id="my-tooltip">
                <span className="flex-grow label-text">
                  <FontAwesomeIcon icon={faCode} style={{ width: '14px' }} className="mr-4" />
                  Custom Browser Tab Title Format
                </span>
                <FormInput
                  defaultValue={userSettings?.customTitleFormatString}
                  onEnter={async (value) => {
                    setUserSetting({ customTitleFormatString: value });
                  }}
                />
              </label>
            </div>
            <Checkbox
              fa={faTableColumns}
              value={userSettings?.useTwoPages || false}
              set={(checked) => {
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
                setUserSetting({ useJapaneseTitle: checked });
              }}
            >
              Show Japanese Title
            </Checkbox>
            <Checkbox
              fa={faBan}
              value={userSettings?.showNsfwContent || false}
              set={(checked) => {
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
