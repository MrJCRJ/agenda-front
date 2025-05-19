import { useState, useEffect, useCallback, useMemo } from "react";
import { AppointmentForm } from "../components/AppointmentForm";
import { AppointmentList } from "../components/appointments/AppointmentList";
import { AppointmentsChart } from "../components/AppointmentsChart";
import { Modal } from "../components/Modal";
import {
  getAppointments,
  deleteAppointment as deleteAppointmentService,
} from "../services/appointmentService";
import { Appointment } from "../types/appointment";
import { DateFilterKey } from "../components/AppointmentsChart/types";
import {
  createDateFilters,
  adjustToLocalTimezone,
} from "../components/AppointmentsChart/utils";

export const HomePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterKey>("today");

  const dateFilters = useMemo(() => createDateFilters(), []);

  // Memoize the filtered appointments
  const filteredAppointments = useMemo(() => {
    if (appointments.length === 0) return [];

    const filter = dateFilters[dateFilter];
    const startDate = new Date(filter.startDate);
    const endDate = new Date(filter.endDate);

    return appointments.filter((appt) => {
      const apptDate = adjustToLocalTimezone(new Date(appt.start));
      return apptDate >= startDate && apptDate <= endDate;
    });
  }, [appointments, dateFilter, dateFilters]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const appts = await getAppointments();
      setAppointments(appts);
    } catch (err) {
      setError("Erro ao carregar dados");
      console.error("loadData error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddAppointment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAppointmentCreated = async (newAppointment: Appointment) => {
    try {
      setAppointments((prev) => [...prev, newAppointment]);
      handleCloseModal();
    } catch (err) {
      setError("Failed to update after creating appointment.");
      console.error("Error:", err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointmentService(id);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      setError("Failed to delete appointment. Please try again.");
      console.error("Error deleting appointment:", err);
    }
  };

  const handleRetry = () => {
    setError(null);
    loadData();
  };

  const handleFilterChange = (filter: DateFilterKey) => {
    setDateFilter(filter);
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
            onClick={handleRetry}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Refresh"
          >
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

        <section className="bg-white shadow rounded-lg overflow-hidden p-4">
          <AppointmentsChart
            appointments={appointments}
            dateFilter={dateFilter}
            onFilterChange={handleFilterChange}
          />
        </section>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Appointments ({filteredAppointments.length})
          </h2>
          <button
            onClick={handleAddAppointment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
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
            <span className="ml-2">Add Appointment</span>
          </button>
        </div>

        <section className="bg-white shadow rounded-lg overflow-hidden">
          {filteredAppointments.length > 0 ? (
            <AppointmentList
              appointments={filteredAppointments}
              onAppointmentDeleted={handleDeleteAppointment}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              No appointments scheduled for the selected period
            </div>
          )}
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
