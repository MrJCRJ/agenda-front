import { useState, useEffect } from "react";
import { AppointmentForm } from "../components/AppointmentForm";
import { AppointmentList } from "../components/AppointmentList";
import { getAppointments } from "../services/appointmentService";
import { Appointment } from "../types/appointment";

export const HomePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch appointments");
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
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={fetchAppointments}
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
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Appointment Scheduler
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg">
            Manage your appointments efficiently
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4 mb-6 sm:p-6 sm:shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            {editingAppointment ? "Edit Appointment" : "Create New Appointment"}
          </h2>
          <AppointmentForm
            appointment={editingAppointment || undefined}
            onSuccess={() => {
              setEditingAppointment(null);
              fetchAppointments();
            }}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden sm:shadow-md">
          <div className="px-4 py-3 border-b border-gray-200 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Upcoming Appointments
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""} scheduled
                </p>
              </div>
              {appointments.length > 0 && (
                <div className="mt-2 sm:mt-0 text-xs text-gray-500">
                  Swipe left on items to edit/delete
                </div>
              )}
            </div>
          </div>
          <AppointmentList appointments={appointments} />
        </div>
      </div>
    </div>
  );
};
