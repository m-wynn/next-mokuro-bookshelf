'use client';
import React from 'react';
import type { SeriesPayload } from './page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { updateSeries } from './functions';

const SeriesTable = ({ series }: { series: SeriesPayload[] }) => {
  return (
    <table className="table bg-base-200">
      <thead>
        <tr>
          <th></th>
          <th>English Name</th>
          <th>Japanese Name</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {series.map((series) => (
          <React.Fragment key={series.id}>
            <tr>
              <th>{series.id}</th>
              <th>
                <FormInput
                  defaultValue={series.englishName}
                  onEnter={async (value) => {
                    await updateSeries(series.id, { englishName: value });
                  }}
                />
              </th>
              <th>
                <FormInput
                  defaultValue={series.japaneseName}
                  onEnter={async (value) => {
                    await updateSeries(series.id, { japaneseName: value });
                  }}
                />
              </th>
              <th>{series.createdAt.toUTCString()}</th>
              <th>{series.updatedAt.toUTCString()}</th>
            </tr>
            {series.volumes.length > 0 && (
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
                      {series.volumes.map((volume) => (
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
};

const FormInput = ({
  defaultValue,
  onEnter,
}: {
  defaultValue: string;
  onEnter: (value: string) => Promise<void>;
}) => {
  enum LoadingState {
    NORMAL,
    LOADING,
    RECENTLY_UPDATED,
  }
  const [loadingState, setLoadingState] = React.useState(LoadingState.NORMAL);
  return (
    <div className="indicator">
      {loadingState != LoadingState.NORMAL &&
        (loadingState == LoadingState.LOADING ? (
          <span className="indicator-item badge badge-secondary">
            <span className="loading loading-ball loading-xs"></span>
          </span>
        ) : (
          <span className="indicator-item badge badge-success">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ))}
      <input
        type="text"
        className="max-w-40 input input-bordered"
        defaultValue={defaultValue}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            if (e.target instanceof HTMLInputElement) {
              setLoadingState(LoadingState.LOADING);
              e.target.blur();
              await onEnter(e.target.value);
              setLoadingState(LoadingState.RECENTLY_UPDATED);
              setTimeout(() => {
                setLoadingState(LoadingState.NORMAL);
              }, 10000);
            }
          }
        }}
      />
    </div>
  );
};

export default SeriesTable;
