import { useState, useEffect } from "react";
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
  onCancel?: () => void;
}

const initialFormData: Omit<Appointment, "_id"> = {
  title: "Padaria",
  start: new Date(),
  end: new Date(new Date().getTime() + 60 * 60 * 1000),
};

const APPOINTMENT_TYPES = [
  { value: "Padaria", label: "Padaria" },
  { value: "HeroPet", label: "HeroPet" },
  { value: "Tarefas", label: "Tarefas" },
  { value: "Projeto", label: "Projeto" },
  { value: "Hobby", label: "Hobby" },
  { value: "Estudo", label: "Estudo" },
  { value: "Lazer", label: "Lazer" },
];

export const AppointmentForm = ({
  appointment,
  onSuccess,
  onCancel,
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState<Appointment>({
    ...initialFormData,
    ...appointment,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const startDate = new Date(formData.start);
      const endDate = new Date(formData.end);

      if (startDate >= endDate) {
        setError("O horário final deve ser após o horário inicial");
        return;
      }

      const action = appointment?._id
        ? updateAppointment(appointment._id, formData)
        : createAppointment(formData);

      const result = await action;
      onSuccess(result);
    } catch (error) {
      setError("Erro ao salvar o agendamento. Tente novamente.");
      console.error("Error saving appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Appointment, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        <FormField
          id="title"
          label="Tipo de Agendamento"
          type="select"
          value={formData.title}
          onChange={(value) => handleChange("title", value)}
          required
          options={APPOINTMENT_TYPES}
        />

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data e Hora Inicial
            </label>
            <input
              id="start-time"
              type="datetime-local"
              onChange={(e) =>
                handleChange("start", new Date(e.target.value).toISOString())
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data e Hora Final
            </label>
            <input
              id="end-time"
              type="datetime-local"
              onChange={(e) =>
                handleChange("end", new Date(e.target.value).toISOString())
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <SubmitButton isSubmitting={isSubmitting} normalText="Criar" />
      </div>
    </form>
  );
};
