import { Appointment, Task } from "../types/appointment";
import { useEffect, useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

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
  isCurrent,
  totalTasks,
  completedTasks,
}: {
  date: string;
  time: string;
  isCurrent?: boolean;
  totalTasks: number;
  completedTasks: number;
}) => (
  <div className="flex flex-col items-end">
    <div
      className={`flex items-center text-sm ${
        isCurrent ? "text-green-600 font-medium" : "text-gray-500"
      }`}
    >
      <span className="mr-2">{date}</span>
      <span>{time}</span>
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

const AppointmentItem = ({ appointment }: { appointment: Appointment }) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [tasks, setTasks] = useState(appointment.tasks || []);

  useEffect(() => {
    const checkCurrent = () => {
      const now = new Date();
      const start = new Date(appointment.start);
      const end = new Date(appointment.end);
      setIsCurrent(now >= start && now <= end);
    };

    checkCurrent();
    const interval = setInterval(checkCurrent, 60000);

    return () => clearInterval(interval);
  }, [appointment.start, appointment.end]);

  const handleTaskAdded = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleTasksUpdated = () => {
    // Lógica para recarregar tasks se necessário
  };

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

  const appointmentId = appointment._id || "";
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <li
      className={`bg-white rounded-lg shadow-sm border ${
        isCurrent ? "border-green-300" : "border-gray-100"
      } overflow-hidden hover:shadow-md transition-all`}
    >
      <div className="p-3 sm:p-4">
        <div
          className="flex items-center justify-between gap-4 cursor-pointer"
          onClick={() => setShowTasks(!showTasks)}
        >
          <h3
            className={`text-base font-medium ${
              isCurrent ? "text-green-800" : "text-gray-900"
            } truncate flex-1`}
          >
            {appointment.title}
          </h3>

          <AppointmentDateTime
            date={date}
            time={`${startTime} - ${endTime}`}
            isCurrent={isCurrent}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
          />
        </div>

        {showTasks && (
          <div className="mt-4 space-y-4">
            <TaskForm
              appointmentId={appointmentId}
              onTaskAdded={handleTaskAdded}
            />
            <TaskList
              tasks={tasks}
              appointmentId={appointmentId}
              onTasksUpdated={handleTasksUpdated}
            />
          </div>
        )}
      </div>
    </li>
  );
};

export const AppointmentList = ({ appointments }: AppointmentListProps) => {
  const [sortedAppointments, setSortedAppointments] = useState<Appointment[]>(
    []
  );

  useEffect(() => {
    // Ordena do mais recente para o mais antigo (mais recentes no topo)
    const sorted = [...appointments].sort((a, b) => {
      return new Date(b.start).getTime() - new Date(a.start).getTime();
    });
    setSortedAppointments(sorted);
  }, [appointments]);

  if (sortedAppointments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 px-2 sm:px-0">
        Upcoming Appointments
      </h2>

      <ul className="space-y-2">
        {sortedAppointments.map((appointment) => (
          <AppointmentItem key={appointment._id} appointment={appointment} />
        ))}
      </ul>
    </div>
  );
};
