import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppointmentForm } from "../components/AppointmentForm";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import {
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";
import { Appointment, Task } from "../types/appointment";

export const AppointmentPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getAppointment(id);
        setAppointment(data);
      } catch (err) {
        setError("Failed to fetch appointment");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleSave = async (updatedAppointment: Appointment) => {
    try {
      if (appointment?._id) {
        const savedAppointment = await updateAppointment(
          appointment._id,
          updatedAppointment
        );
        setAppointment(savedAppointment);
      }
    } catch (err) {
      setError("Failed to update appointment");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!appointment?._id) return;

    try {
      await deleteAppointment(appointment._id);
      navigate("/");
    } catch (err) {
      setError("Failed to delete appointment");
      console.error(err);
    }
  };

  const handleTaskAdded = (task: Task) => {
    if (!appointment) return;
    setAppointment({
      ...appointment,
      tasks: [...(appointment.tasks || []), task],
    });
  };

  const handleTasksUpdated = () => {
    if (!id) return;
    getAppointment(id).then((data) => setAppointment(data));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Refresh</title>
              <path d="M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {id ? "Edit Appointment" : "Create New Appointment"}
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <AppointmentForm
            appointment={appointment || undefined}
            onSuccess={handleSave}
          />
        </div>

        {appointment?._id && (
          <>
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tasks
              </h2>
              <TaskForm
                appointmentId={appointment._id}
                onTaskAdded={handleTaskAdded}
              />
              <div className="mt-4">
                <TaskList
                  tasks={appointment.tasks || []}
                  appointmentId={appointment._id}
                  onTasksUpdated={handleTasksUpdated}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Appointment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
