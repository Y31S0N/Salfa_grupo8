import React from "react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

interface NavItemProps {
  to: string;
  icon: ReactNode;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, onClick }) => {
  const handleClickSignOut = async () => {
    await signOut(auth);
  };

  if (onClick) {
    return (
      <li>
        <Link
          to={to}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          onClick={handleClickSignOut}
        >
          {icon}
          <span className="ml-2">{text}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={to}
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
      >
        {icon}
        <span className="ml-2">{text}</span>
      </Link>
    </li>
  );
};

export default NavItem;
