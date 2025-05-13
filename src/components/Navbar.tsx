import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-lg font-medium text-blue-600"
            >
              Appointment Scheduler
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/appointment"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              New Appointment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
