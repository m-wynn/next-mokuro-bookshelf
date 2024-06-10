'use client';

import React from 'react';
import FormInput from '@/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { SeriesPayload } from './page';
import { updateSeries } from './functions';

function FormCheckbox({
  defaultValue,
  onEnter,
}: {
  defaultValue: boolean;
  onEnter: (_value: boolean) => Promise<void>;
}) {
  enum LoadingState {
    NORMAL,
    LOADING,
    RECENTLY_UPDATED,
  }
  const [loadingState, setLoadingState] = React.useState(LoadingState.NORMAL);
  return (
    <div className="indicator">
      {loadingState !== LoadingState.NORMAL
        && (loadingState === LoadingState.LOADING ? (
          <span className="indicator-item badge badge-secondary">
            <span className="loading loading-ball loading-xs" />
          </span>
        ) : (
          <span className="indicator-item badge badge-success">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ))}
      <input
        type="checkbox"
        className="checkbox"
        defaultChecked={defaultValue}
        onClick={async (e) => {
          if (e.target instanceof HTMLInputElement) {
            setLoadingState(LoadingState.LOADING);
            e.target.blur();
            await onEnter(e.target.checked);
            setLoadingState(LoadingState.RECENTLY_UPDATED);
            setTimeout(() => {
              setLoadingState(LoadingState.NORMAL);
            }, 10000);
          }
        }}
      />
    </div>
  );
}

function SeriesTable({ series }: { series: SeriesPayload[] }) {
  return (
    <table className="table bg-base-200">
      <thead>
        <tr>
          <th aria-label="ID"></th>
          <th>English Name</th>
          <th>Japanese Name</th>
          <th>Short Name</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Is NSFW</th>
        </tr>
      </thead>
      <tbody>
        {series.map((each) => (
          <React.Fragment key={each.id}>
            <tr>
              <th>{each.id}</th>
              <th>
                <FormInput
                  defaultValue={each.englishName}
                  onEnter={async (value) => {
                    await updateSeries(each.id, { englishName: value });
                  }}
                />
              </th>
              <th>
                <FormInput
                  defaultValue={each.japaneseName}
                  onEnter={async (value) => {
                    await updateSeries(each.id, { japaneseName: value });
                  }}
                />
              </th>
              <th>
                <FormInput
                  defaultValue={each.shortName}
                  onEnter={async (value) => {
                    await updateSeries(each.id, { shortName: value });
                  }}
                />
              </th>
              <th>{each.createdAt.toUTCString()}</th>
              <th>{each.updatedAt.toUTCString()}</th>
              <td>
                <FormCheckbox
                  defaultValue={each.isNsfw}
                  onEnter={async (value) => {
                    await updateSeries(each.id, { isNsfw: value });
                  }}
                />
              </td>
            </tr>
            {each.volumes.length > 0 && (
              <tr>
                <td colSpan={5}>
                  <table className="table bg-base-200">
                    <thead>
                      <tr>
                        <th>Vol</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Uploaded By</th>
                        <th>Readings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {each.volumes.map((volume) => (
                        <tr key={volume.number}>
                          <td>{volume.number}</td>
                          <td>{volume.createdAt.toUTCString()}</td>
                          <td>{volume.updatedAt.toUTCString()}</td>
                          <td>{volume.uploadedBy.name}</td>
                          <td>{volume._count.readings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default SeriesTable;
