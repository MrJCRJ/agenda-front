// components/appointments/AppointmentList.tsx
import { useState, useEffect } from "react";
import { Appointment } from "../../types/appointment";
import { EmptyState } from "../shared/EmptyState";
import { AppointmentItem } from "./AppointmentItem";

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentDeleted?: (deletedId: string) => void;
}

export const AppointmentList = ({
  appointments: initialAppointments,
  onAppointmentDeleted,
}: AppointmentListProps) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [sortedAppointments, setSortedAppointments] = useState<Appointment[]>(
    []
  );

  useEffect(() => {
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  useEffect(() => {
    const sorted = [...appointments].sort((a, b) => {
      return new Date(b.start).getTime() - new Date(a.start).getTime();
    });
    setSortedAppointments(sorted);
  }, [appointments]);

  const handleAppointmentDeleted = (deletedId: string) => {
    setAppointments((prev) => prev.filter((app) => app._id !== deletedId));
    onAppointmentDeleted?.(deletedId);
  };

  if (sortedAppointments.length === 0) {
    return (
      <EmptyState
        title="No appointments"
        description="Get started by creating a new appointment."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 px-2 sm:px-0">
        Upcoming Appointments
      </h2>

      <ul className="space-y-2">
        {sortedAppointments.map((appointment) => (
          <AppointmentItem
            key={appointment._id}
            appointment={appointment}
            onAppointmentDeleted={handleAppointmentDeleted}
          />
        ))}
      </ul>
    </div>
  );
};
