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
        setIsLoading(true);
        const data = await getAppointment(id);
        setAppointment(data);
        setError(null);
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
      setIsLoading(true);
      if (appointment?._id) {
        const savedAppointment = await updateAppointment(
          appointment._id,
          updatedAppointment
        );
        setAppointment(savedAppointment);
        setError(null);
      }
    } catch (err) {
      setError("Failed to update appointment");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!appointment?._id) return;

    try {
      setIsLoading(true);
      await deleteAppointment(appointment._id);
      navigate("/");
    } catch (err) {
      setError("Failed to delete appointment");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAdded = (task: Task) => {
    if (!appointment) return;
    setAppointment({
      ...appointment,
      tasks: [...(appointment.tasks || []), task],
    });
  };

  const handleTasksUpdated = async () => {
    if (!id) return;
    try {
      const data = await getAppointment(id);
      setAppointment(data);
    } catch (err) {
      setError("Failed to refresh tasks");
      console.error(err);
    }
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 transition-colors"
              >
                Refresh page →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {id ? "Edit Appointment" : "Create Appointment"}
          </h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6">
          <AppointmentForm
            appointment={appointment || undefined}
            onSuccess={handleSave}
          />
        </div>

        {appointment?._id && (
          <>
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
                <span className="text-sm text-gray-500">
                  {appointment.tasks?.length || 0} tasks
                </span>
              </div>

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

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to List
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Appointment"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
