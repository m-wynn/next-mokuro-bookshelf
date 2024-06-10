'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function FormInput({
  defaultValue,
  onEnter,
}: {
  defaultValue: string;
  onEnter: (_value: string) => Promise<void>;
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
}
