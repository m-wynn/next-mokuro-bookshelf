'use client';

import React from 'react';

export default function ConfirmDenyModal({
  header,
  message,
  dialogRef,
  callback,
}: {
  header?: string,
  message: string,
  dialogRef: React.RefObject<HTMLDialogElement>;
  callback: (accepted: boolean) => void;
}) {
  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="text-center modal-box">
        { header ? <span className="text-2xl font-bold">{ header }</span> : null }
        <div className="mt-4">
          { message }
        </div>
        <div className="flex-row justify-center modal-action">
          <button type="button" className="btn" onClick={(_e) => { callback(true); }}>Yes</button>
          <button type="button" className="btn" onClick={(_e) => { callback(false); }}>No</button>
        </div>
      </div>
    </dialog>
  );
}
