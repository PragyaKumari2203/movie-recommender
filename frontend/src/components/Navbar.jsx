import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const linkStyles =
    "transition duration-200 px-2 py-1 rounded";

  const activeStyles =
    "text-gray-200 font-semibold border-b-2 border-gray-400";

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">🎬 MovieRecs</h1>
        <ul className="flex space-x-6 text-lg font-medium">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${linkStyles} ${activeStyles}` : `${linkStyles} hover:text-gray-500`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/details"
              className={({ isActive }) =>
                isActive ? `${linkStyles} ${activeStyles}` : `${linkStyles} hover:text-gray-500`
              }
            >
              Details
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? `${linkStyles} ${activeStyles}` : `${linkStyles} hover:text-gray-500`
              }
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
