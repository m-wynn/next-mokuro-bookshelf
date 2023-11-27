import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
class NavBarProps {
  setSearch: Dispatch<SetStateAction<string>>;
}

const NavBar = ({ setSearch }: NavBarProps) => (
  <div className="mb-4 shadow navbar bg-ctp-surface1">
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Link href="/addnew" className="normal-case btn btn-primary">
        Manage Bookshelf
      </Link>
    </div>
  </div>
);

export default NavBar;
