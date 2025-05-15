import { Appointment, Task } from "../types/appointment";
import { useEffect, useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { deleteAppointment } from "../services/appointmentService";

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentDeleted?: (deletedId: string) => void;
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

const AppointmentItem = ({
  appointment,
  onAppointmentDeleted,
}: {
  appointment: Appointment;
  onAppointmentDeleted?: (deletedId: string) => void;
}) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [tasks, setTasks] = useState(appointment.tasks || []);
  const [isDeleting, setIsDeleting] = useState(false);

  // Adicione esta função para atualizar as tasks
  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTasksUpdated = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Isso impede que o evento borbulhe para o elemento pai
    handleDeleteAppointment();
  };

  const handleDeleteAppointment = async () => {
    if (!appointment._id) return;

    setIsDeleting(true);
    try {
      await deleteAppointment(appointment._id);
      if (onAppointmentDeleted) {
        onAppointmentDeleted(appointment._id);
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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

          <button
            onClick={handleDeleteClick} // Usamos a nova função aqui
            disabled={isDeleting}
            className="ml-2 p-1 text-red-500 hover:text-red-700"
            title="Delete appointment"
          >
            {isDeleting ? (
              <svg className="animate-spin h-5 w-5" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
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

export const AppointmentList = ({
  appointments: initialAppointments,
  onAppointmentDeleted,
}: AppointmentListProps) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [sortedAppointments, setSortedAppointments] = useState<Appointment[]>(
    []
  );

  useEffect(() => {
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  useEffect(() => {
    const sorted = [...appointments].sort((a, b) => {
      return new Date(b.start).getTime() - new Date(a.start).getTime();
    });
    setSortedAppointments(sorted);
  }, [appointments]);

  const handleAppointmentDeleted = (deletedId: string) => {
    setAppointments((prev) => prev.filter((app) => app._id !== deletedId));
    if (onAppointmentDeleted) {
      onAppointmentDeleted(deletedId);
    }
  };

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
          <AppointmentItem
            key={appointment._id}
            appointment={appointment}
            onAppointmentDeleted={handleAppointmentDeleted}
          />
        ))}
      </ul>
    </div>
  );
};
