'use client';

import {
  faSun,
  faMoon,
  faGear,
  faScrewdriverWrench,
  faBookMedical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { Session } from 'lucia';
import { useGlobalContext } from './GlobalContext';

function Navbar({ session }: { session: Session }) {
  const { fullScreen } = useGlobalContext();
  // Light/Dark theme is still handled by the theme-controller input in the navbar
  // So we have to keep it in the DOM
  return (
    <div
      className={`shadow navbar bg-base-300 overflow-hidden ${
        fullScreen ? 'h-0 w-0 m-0 p-0 min-h-0' : 'h-16'
      }`}
    >
      <div className="flex-1">
        <Link href="/" className="text-xl normal-case btn btn-ghost">
          Hondana
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="w-24 md:w-auto input input-bordered"
          />
        </div>
        <Link
          href="/allbooks"
          className="text-2xl normal-case btn btn-primary"
        >
          <FontAwesomeIcon icon={faBookMedical} />
        </Link>
        {session.user && (
        <Link
          href="/user/settings"
          className="text-2xl normal-case btn btn-primary"
        >
          <FontAwesomeIcon icon={faGear} />
        </Link>
        )}
        {session.user?.role === 'ADMIN' && (
        <Link
          href="/admin"
          className="text-2xl normal-case btn btn-primary"
        >
          <FontAwesomeIcon icon={faScrewdriverWrench} />
        </Link>
        )}
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            className="theme-controller"
            value="catppuccin-latte"
          />
          <FontAwesomeIcon
            icon={faSun}
            className="w-10 text-4xl fill-current f-10 swap-on"
          />
          <FontAwesomeIcon
            icon={faMoon}
            className="w-10 text-4xl fill-current f-10 swap-off"
          />
        </label>
      </div>
    </div>
  );
}

export default Navbar;
