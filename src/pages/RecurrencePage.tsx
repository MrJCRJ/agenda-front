import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppointmentForm } from "../components/AppointmentForm";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import {
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointments,
} from "../services/appointmentService";
import { Appointment } from "../types/appointment";

export const RecurrencePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mainAppointment, setMainAppointment] = useState<Appointment | null>(
    null
  );
  const [recurringInstances, setRecurringInstances] = useState<Appointment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [main, instances] = await Promise.all([
          getAppointment(id!),
          getAppointments(`recurrenceId=${id}`),
        ]);

        setMainAppointment(main);
        setRecurringInstances(instances);
      } catch (err) {
        setError("Failed to fetch recurrence data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateInstance = async (
    instanceId: string,
    updates: Partial<Appointment>
  ) => {
    try {
      await updateAppointment(instanceId, updates);
      const instances = await getAppointments(`recurrenceId=${id}`);
      setRecurringInstances(instances);
    } catch (err) {
      setError("Failed to update instance");
      console.error(err);
    }
  };

  const handleDeleteSeries = async () => {
    if (!mainAppointment?._id) return;

    try {
      await deleteAppointment(mainAppointment._id, true);
      navigate("/");
    } catch (err) {
      setError("Failed to delete series");
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

  if (!mainAppointment) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Appointment not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Recurring Appointment Series
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Appointment Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Main Appointment
            </h2>
            <AppointmentForm
              appointment={mainAppointment}
              onSuccess={(updated) => setMainAppointment(updated)}
            />
          </div>

          {/* Tasks Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Series Tasks
            </h2>
            <TaskForm
              appointmentId={mainAppointment._id!}
              onTaskAdded={(task) => {
                setMainAppointment({
                  ...mainAppointment,
                  tasks: [...(mainAppointment.tasks || []), task],
                });
              }}
            />
            <div className="mt-4">
              <TaskList
                tasks={mainAppointment.tasks || []}
                appointmentId={mainAppointment._id!}
                onTasksUpdated={async () => {
                  const updated = await getAppointment(mainAppointment._id!);
                  setMainAppointment(updated);
                }}
              />
            </div>
          </div>
        </div>

        {/* Recurring Instances Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recurring Instances
          </h2>
          {recurringInstances.length === 0 ? (
            <p className="text-gray-500">No recurring instances found.</p>
          ) : (
            <div className="space-y-4">
              {recurringInstances.map((instance) => (
                <div
                  key={instance._id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {instance.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(instance.start).toLocaleString()} -{" "}
                        {new Date(instance.end).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleUpdateInstance(instance._id!, {
                          title: `${instance.title} (Modified)`,
                        })
                      }
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                    >
                      Modify Instance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDeleteSeries}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Entire Series
          </button>
        </div>
      </div>
    </div>
  );
};
