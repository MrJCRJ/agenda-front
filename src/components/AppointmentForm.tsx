import { useState } from "react";
import { Appointment } from "../types/appointment";
import {
  createAppointment,
  updateAppointment,
} from "../services/appointmentService";
import { ErrorMessage } from "./ui/ErrorMessage";
import { SubmitButton } from "./ui/SubmitButton";
import { FormField } from "./ui/FormField";

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess: (updatedAppointment: Appointment) => void;
}

const initialFormData: Omit<Appointment, "_id"> = {
  title: "",
  start: new Date(),
  end: new Date(),
};

const APPOINTMENT_TYPES = [
  { value: "Padaria", label: "Padaria" },
  { value: "HeroPet", label: "HeroPet" },
  { value: "Tarefas", label: "Tarefas" },
  { value: "Projeto", label: "Projeto" },
];

export const AppointmentForm = ({
  appointment,
  onSuccess,
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState<Appointment>(
    appointment || initialFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const action = appointment?._id
        ? updateAppointment(appointment._id, formData)
        : createAppointment(formData);

      const result = await action;
      onSuccess(result);
    } catch (error) {
      setError("Failed to save appointment");
      console.error("Error saving appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Appointment, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        <FormField
          id="title"
          label="Appointment Type"
          type="select"
          value={formData.title || "Padaria"}
          onChange={(value) => handleChange("title", value)}
          required
          options={APPOINTMENT_TYPES}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            id="start-time"
            label="Start Time"
            type="datetime-local"
            value={formData.start.toString().substring(0, 16)}
            onChange={(value) => handleChange("start", value)}
            required
          />

          <FormField
            id="end-time"
            label="End Time"
            type="datetime-local"
            value={formData.end.toString().substring(0, 16)}
            onChange={(value) => handleChange("end", value)}
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
};
