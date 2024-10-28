import { Menu } from "lucide-react";

interface HeaderProps {
  toggleNav: any;
}
function Header({ toggleNav }: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
      <button
        onClick={toggleNav}
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <Menu size={24} className="text-gray-600" />
      </button>
      <h1 className="text-xl font-bold text-gray-800">Mi Dashboard</h1>
    </header>
  );
}
export default Header;
