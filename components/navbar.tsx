import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
class NavBarProps {
  setSearch: Dispatch<SetStateAction<string>>;
}

const NavBar = ({ setSearch }: NavBarProps) => (
  <div className="navbar bg-ctp-surface1 shadow mb-4">
    <div className="flex-1">
      <Link href="/" className="btn btn-ghost normal-case text-xl">
        Hondana
      </Link>
    </div>
    <div className="flex-none gap-2">
      <div className="form-control">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Link href="/addnew" className="btn btn-primary normal-case">
        Manage Bookshelf
      </Link>
    </div>
  </div>
);

export default NavBar;
