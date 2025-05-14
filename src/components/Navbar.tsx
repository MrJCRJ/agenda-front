import { Link } from "react-router-dom";
import { useState } from "react";

// Define icons locally to avoid dependency issues
const MenuIcon = () => (
  <svg
    className="block h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="block h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper function to determine active link
  const isActive = (path: string) => {
    return window.location.pathname === path
      ? "text-blue-600 border-b-2 border-blue-500"
      : "";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 text-lg font-medium text-blue-600 flex items-center"
            >
              <svg
                className="h-6 w-6 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="hidden sm:inline">Appointment Scheduler</span>
              <span className="sm:hidden">Scheduler</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>
            <Link
              to="/appointment"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${isActive(
                "/appointment"
              )}`}
            >
              New Appointment
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="pt-2 pb-3 space-y-1 px-2">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors ${isActive(
              "/"
            )}`}
          >
            Home
          </Link>
          <Link
            to="/appointment"
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors ${isActive(
              "/appointment"
            )}`}
          >
            New Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
};
