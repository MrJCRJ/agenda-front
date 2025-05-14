import { useState } from "react";
import { Appointment } from "../types/appointment";
import {
  createAppointment,
  updateAppointment,
} from "../services/appointmentService";
import { RecurrenceForm } from "./RecurrenceForm";

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess: (updatedAppointment: Appointment) => void;
}

export const AppointmentForm = ({
  appointment,
  onSuccess,
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState<Appointment>(
    appointment || {
      title: "",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      isRecurring: false,
      recurrenceRule: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (appointment?._id) {
        const updated = await updateAppointment(appointment._id, formData);
        onSuccess(updated);
      } else {
        const created = await createAppointment(formData);
        onSuccess(created);
      }
    } catch (error) {
      setError("Failed to save appointment");
      console.error("Error saving appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
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
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Dentist visit, Meeting, etc."
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Time
            </label>
            <input
              id="start-time"
              type="datetime-local"
              value={formData.start.toString().substring(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, start: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Time
            </label>
            <input
              id="end-time"
              type="datetime-local"
              value={formData.end.toString().substring(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, end: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="recurring-checkbox"
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isRecurring: e.target.checked,
                  recurrenceRule: e.target.checked ? "FREQ=WEEKLY;COUNT=3" : "",
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="recurring-checkbox"
              className="ml-2 block text-sm text-gray-700"
            >
              Este é um evento recorrente
            </label>
          </div>

          {formData.isRecurring && (
            <div className="mt-4">
              <RecurrenceForm
                onSave={(rule) =>
                  setFormData({ ...formData, recurrenceRule: rule })
                }
                initialRule={formData.recurrenceRule}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Processing...
            </>
          ) : (
            "Save Appointment"
          )}
        </button>
      </div>
    </form>
  );
};
