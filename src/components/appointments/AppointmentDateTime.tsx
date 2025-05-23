// components/appointments/AppointmentDateTime.tsx
import { Appointment } from "../../types/appointment";

interface AppointmentDateTimeProps {
  appointment: Pick<Appointment, "start" | "end">;
  isCurrent?: boolean;
  totalTasks: number;
  completedTasks: number;
  compact?: boolean;
}

export const AppointmentDateTime = ({
  appointment,
  isCurrent = false,
  totalTasks,
  completedTasks,
  compact = false,
}: AppointmentDateTimeProps) => {
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

  if (compact) {
    return (
      <div className="text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>{date}</span>
          <span>•</span>
          <span>
            {startTime}-{endTime}
          </span>
          {isCurrent && (
            <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Agora
            </span>
          )}
        </div>
        {totalTasks > 0 && (
          <div className="mt-0.5">
            {completedTasks}/{totalTasks} tasks
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <div
        className={`flex items-center text-sm ${
          isCurrent ? "text-green-600 font-medium" : "text-gray-500"
        }`}
      >
        <span className="mr-2">{date}</span>
        <span>
          {startTime} - {endTime}
        </span>
        {isCurrent && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Agora
          </span>
        )}
      </div>
      {totalTasks > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {completedTasks}/{totalTasks} tasks concluídas
        </div>
      )}
    </div>
  );
};
