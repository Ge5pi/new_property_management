import { BackButton } from 'components/back-button';

import './not-allowed.css';

const NoteAllowed = () => {
  return (
    <div className="not_allowed container text-center">
      <div className="lock">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none">
            <path d="M0 0h24v24H0V0z" />
            <path d="M0 0h24v24H0V0z" opacity=".87" />
          </g>
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
        </svg>
      </div>
      <div className="message">
        <h1 className="fs-1">Access Denied</h1>
        <p>Access to this page is restricted. Please check with the site admin if you believe this is a mistake.</p>
        <BackButton />
      </div>
    </div>
  );
};

export default NoteAllowed;
