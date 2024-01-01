'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="w-56 h-screen menu bg-base-200">
        <li>
          <h2 className="menu-title">Admin</h2>
          <ul>
            <li>
              <Link
                href="/admin/users"
                className={`${pathname === '/admin/users' ? 'active' : ''}`}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/books"
                className={`${pathname === '/admin/books' ? 'active' : ''}`}
              >
                Books
              </Link>
            </li>
            <li>
              <Link
                href="/admin/volumes"
                className={`${pathname === '/admin/volumes' ? 'active' : ''}`}
              >
                New Volume
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
