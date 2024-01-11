import React from 'react';

export default function UploadButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="card rounded-box mb-4">
      <div className="items-center card-body p-1">
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col justify-between items-center w-1/2">
            <div className="flex flex-col-reverse items-center w-1/2">
              <button type="submit" className="w-full btn btn-primary">
                { children }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
