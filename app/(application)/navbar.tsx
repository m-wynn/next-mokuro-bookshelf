import Link from "next/link";
import React from "react";

// import { Container } from './styles';

const Navbar: React.FC = () => {
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
        <Link href="/addnew" className="normal-case btn btn-primary">
          Manage Bookshelf
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
