import {
  faSun,
  faMoon,
  faScrewdriverWrench,
  faBookMedical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const Navbar = ({ role }: { role: string }) => {
  return (
    <div className="shadow navbar bg-base-300">
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
            // todo make search work
          />
        </div>
        <Link href="/allbooks" className="text-2xl normal-case btn btn-primary">
          <FontAwesomeIcon icon={faBookMedical} />
        </Link>
        <Link href="/admin" className="text-2xl normal-case btn btn-primary">
          <FontAwesomeIcon icon={faScrewdriverWrench} />
        </Link>
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
};

export default Navbar;
