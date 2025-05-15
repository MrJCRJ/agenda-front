import { useState, useEffect } from "react";
import { AppointmentForm } from "../components/AppointmentForm";
import { AppointmentList } from "../components/AppointmentList";
import { Modal } from "../components/Modal";
import { getAppointments } from "../services/appointmentService";
import { Appointment } from "../types/appointment";

export const HomePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError("Failed to load appointments. Please try again later.");
        console.error("Error fetching appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleAddAppointment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAppointmentCreated = (newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
    handleCloseModal();
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Scheduler
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your appointments efficiently
          </p>
        </header>

        <div className="flex justify-end">
          <button
            onClick={handleAddAppointment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <PlusIcon />
            Add Appointment
          </button>
        </div>

        <section className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {appointments.length}{" "}
                  {appointments.length === 1 ? "appointment" : "appointments"}{" "}
                  scheduled
                </p>
              </div>
            </div>
          </div>
          <AppointmentList appointments={appointments} />
        </section>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Create New Appointment"
          blurBackdrop={true}
        >
          <AppointmentForm onSuccess={handleAppointmentCreated} />
        </Modal>
      </div>
    </div>
  );
};

// Componentes de ícone auxiliares
const RefreshIcon = () => (
  <svg
    className="h-6 w-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);
