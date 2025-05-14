import { Appointment } from "../types/appointment";

interface AppointmentListProps {
  appointments: Appointment[];
}

const EmptyState = () => (
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
    <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments</h3>
    <p className="mt-1 text-gray-500">
      Get started by creating a new appointment.
    </p>
  </div>
);

const AppointmentDateTime = ({
  date,
  time,
}: {
  date: string;
  time: string;
}) => (
  <div className="flex items-center text-sm text-gray-500">
    <span className="mr-2">{date}</span>
    <span>{time}</span>
  </div>
);

const AppointmentItem = ({ appointment }: { appointment: Appointment }) => {
  const date = new Date(appointment.start).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  const startTime = new Date(appointment.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(appointment.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-medium text-gray-900 truncate flex-1">
            {appointment.title}
          </h3>

          <AppointmentDateTime date={date} time={`${startTime} - ${endTime}`} />
        </div>
      </div>
    </li>
  );
};

export const AppointmentList = ({ appointments }: AppointmentListProps) => {
  if (appointments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 px-2 sm:px-0">
        Upcoming Appointments
      </h2>

      <ul className="space-y-2">
        {appointments.map((appointment) => (
          <AppointmentItem key={appointment._id} appointment={appointment} />
        ))}
      </ul>
    </div>
  );
};
