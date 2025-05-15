// components/appointments/AppointmentItem.tsx
import { useState, useEffect } from "react";
import { Appointment, Task } from "../../types/appointment";
import { deleteAppointment } from "../../services/appointmentService";
import { TaskForm } from "../TaskForm";
import { TaskList } from "../TaskList";
import { AppointmentDateTime } from "./AppointmentDateTime";
import { DeleteAppointmentButton } from "./DeleteAppointmentButton";

interface AppointmentItemProps {
  appointment: Appointment;
  onAppointmentDeleted?: (deletedId: string) => void;
}

export const AppointmentItem = ({
  appointment,
  onAppointmentDeleted,
}: AppointmentItemProps) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [tasks, setTasks] = useState(appointment.tasks || []);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTasksUpdated = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteAppointment();
  };

  const handleDeleteAppointment = async () => {
    if (!appointment._id) return;

    setIsDeleting(true);
    try {
      await deleteAppointment(appointment._id);
      onAppointmentDeleted?.(appointment._id);
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
            appointment={appointment}
            isCurrent={isCurrent}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
          />

          <DeleteAppointmentButton
            isDeleting={isDeleting}
            onClick={handleDeleteClick}
          />
        </div>

        {showTasks && (
          <div className="mt-4 space-y-4">
            <TaskForm
              appointmentId={appointment._id || ""}
              onTaskAdded={handleTaskAdded}
            />
            <TaskList
              tasks={tasks}
              appointmentId={appointment._id || ""}
              onTasksUpdated={handleTasksUpdated}
            />
          </div>
        )}
      </div>
    </li>
  );
};
