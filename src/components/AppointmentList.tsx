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
      <div className="text-center py-8">
        <p className="text-gray-500 italic">No appointments scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointments</h2>

      <ul className="space-y-3">
        {appointments.map((appointment) => (
          <li
            key={appointment._id}
            className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-3 sm:gap-4 p-4 hover:bg-gray-50 transition-colors hover:transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <Link
              to={`/appointment/${appointment._id}`}
              className="sm:col-span-2 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label={`View details of ${appointment.title}`}
            >
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                {appointment.title}
              </h3>

              <div className="mt-1 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(appointment.start).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">End:</span>{" "}
                  {new Date(appointment.end).toLocaleString()}
                </p>
              </div>

              {appointment.isRecurring && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Recurring:{" "}
                    {appointment.recurrenceRule
                      ?.split(";")[0]
                      .split("=")[1]
                      .toLowerCase()}
                  </span>
                </div>
              )}
            </Link>

            <div className="flex items-center justify-end space-x-2 pt-4 sm:pt-0"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};
