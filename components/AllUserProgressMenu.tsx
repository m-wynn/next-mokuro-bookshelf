import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { getAllUserProgress } from 'app/(application)/functions';
import { useState, useRef } from 'react';

function AllUserProgressModal({ volumeId, modalRef } : { volumeId: number, modalRef: any }) {
  const [allUserProgress, setAllUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllUserProgress(volumeId);
    setAllUserProgress(data);
    setLoading(false);
  };

  const handleOpen = () => {
    fetchData();
    modalRef.current?.show();
  };

  return (
    <>
      <button type="button" onClick={handleOpen}>
        <FontAwesomeIcon icon={faPeopleGroup} />
        {' '}
        Who else is reading?
      </button>
      <dialog className="modal" ref={modalRef}>
        <div className="text-center modal-box">
          <span className="text-2xl font-bold">Reading progress for all users</span>
          <div className="mt-4">
            {loading ? (
              <span>Loading...</span>
            ) : (
              allUserProgress && (
                allUserProgress.length === 0 ? (
                  <span>No one is reading this volume</span>
                ) : (
                  allUserProgress.map((userProgress) => (
                    <div key={userProgress.id}>
                      <span>{userProgress.page}</span>
                    </div>
                  ))
                )
              )
            )}
          </div>
          <div className="flex-row justify-center modal-action">
            <button type="button" className="btn" onClick={() => { modalRef.current?.close(); }}>Close</button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default function AllUserProgressMenu({ volumeId } : { volumeId: number }) {
  const modalRef = useRef(null);

  return (
    <li>
      <AllUserProgressModal volumeId={volumeId} modalRef={modalRef} />
    </li>
  );
}
