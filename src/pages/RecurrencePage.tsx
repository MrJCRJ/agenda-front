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
  const [activeTab, setActiveTab] = useState<"details" | "instances">(
    "details"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [main, instances] = await Promise.all([
          getAppointment(id!),
          getAppointments(`recurrenceId=${id}`),
        ]);

        setMainAppointment(main);
        setRecurringInstances(instances);
        setError(null);
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
      setIsLoading(true);
      await updateAppointment(instanceId, updates);
      const instances = await getAppointments(`recurrenceId=${id}`);
      setRecurringInstances(instances);
      setError(null);
    } catch (err) {
      setError("Failed to update instance");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSeries = async () => {
    if (!mainAppointment?._id) return;

    if (
      !window.confirm("Are you sure you want to delete this entire series?")
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteAppointment(mainAppointment._id, true);
      navigate("/");
    } catch (err) {
      setError("Failed to delete series");
      console.error(err);
    } finally {
      setIsLoading(false);
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
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
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mainAppointment) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center py-12">
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mt-2 text-lg font-medium text-gray-900">
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
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Recurring Appointment Series
          </h1>
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("instances")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "instances"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Instances
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          {/* Main Content - Mobile Tab Panels */}
          {(activeTab === "details" || !isMobile) && (
            <>
              <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Main Appointment
                </h2>
                <AppointmentForm
                  appointment={mainAppointment}
                  onSuccess={(updated) => setMainAppointment(updated)}
                />
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
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
                      const updated = await getAppointment(
                        mainAppointment._id!
                      );
                      setMainAppointment(updated);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {(activeTab === "instances" || !isMobile) && (
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recurring Instances
                </h2>
                <span className="text-sm text-gray-500">
                  {recurringInstances.length} occurrences
                </span>
              </div>

              {recurringInstances.length === 0 ? (
                <div className="text-center py-6">
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
                  <p className="mt-2 text-sm text-gray-500">
                    No instances found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recurringInstances.map((instance) => (
                    <div
                      key={instance._id}
                      className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {instance.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(instance.start).toLocaleDateString()} •{" "}
                            {new Date(instance.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(instance.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleUpdateInstance(instance._id!, {
                              title: `${instance.title} (Modified)`,
                            })
                          }
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors whitespace-nowrap"
                          disabled={isLoading}
                        >
                          Modify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleDeleteSeries}
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
              "Delete Entire Series"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper to detect mobile (simplified version)
const isMobile = window.innerWidth < 640;
