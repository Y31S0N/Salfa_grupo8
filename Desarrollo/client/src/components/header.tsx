import React from 'react';
import { Menu } from "lucide-react";
import { useUser } from "../contexts/UserContext";

interface HeaderProps {
  toggleNav: any;
}

function Header({ toggleNav }: HeaderProps) {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
      <button
        onClick={toggleNav}
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <Menu size={24} className="text-gray-600" />
      </button>
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Bienvenido{" "}
          {user?.displayName && user.displayName.trim() !== ""
            ? user.displayName
            : user?.email}
        </h1>
        {user?.role && (
          <p className="text-sm text-gray-600">Rol: {user.role}</p>
        )}
      </div>
    </header>
  );
}

export default Header;
