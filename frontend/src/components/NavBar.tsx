import {  useState } from "react";
import { HiLogout, HiPhone, HiUser } from "react-icons/hi";
type NavBarProps = {
  activeMenu?: string;
};

function NavBar({ activeMenu = "call-center" }: NavBarProps) {
  const [username] = useState(localStorage.getItem("username"));

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <HiPhone className="w-6 h-6" />
              <span className="font-bold text-lg">Call System</span>
            </div>

            <div className="hidden md:flex space-x-4">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeMenu === "call-center"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                Call Center
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeMenu === "history"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                History
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeMenu === "settings"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-indigo-700 px-3 py-2 rounded-md">
              <HiUser className="w-5 h-5" />
              <span className="text-sm font-medium">{username}</span>
            </div>
            <button className="p-2 hover:bg-indigo-700 rounded-md transition">
              <HiLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
