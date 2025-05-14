import { Link } from "react-router-dom";
import { Appointment } from "../types/appointment";

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onEdit: (appointment: Appointment) => void;
}

export const AppointmentList = ({ appointments }: AppointmentListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No appointments
        </h3>
        <p className="mt-1 text-gray-500">
          Get started by creating a new appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 px-2 sm:px-0">
        Upcoming Appointments
      </h2>

      <ul className="space-y-2">
        {appointments.map((appointment) => (
          <li
            key={appointment._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-3 sm:p-4">
              <Link
                to={`/appointment/${appointment._id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`View details of ${appointment.title}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {appointment.title}
                    </h3>

                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {new Date(appointment.start).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          />
                        </svg>
                        <span>
                          {new Date(appointment.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(appointment.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {appointment.isRecurring && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Recorrente:{" "}
                        {
                          appointment.recurrenceRule
                            ?.split(";")[0]
                            .split("=")[1]
                        }
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="mt-3 flex justify-end space-x-2"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
