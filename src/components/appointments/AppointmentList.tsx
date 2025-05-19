import { useMemo } from "react";
import { Appointment } from "../../types/appointment";
import { EmptyState } from "../shared/EmptyState";
import { AppointmentItem } from "./AppointmentItem";

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentDeleted?: (deletedId: string) => void;
}

export const AppointmentList = ({
  appointments,
  onAppointmentDeleted,
}: AppointmentListProps) => {
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      return new Date(b.start).getTime() - new Date(a.start).getTime();
    });
  }, [appointments]);

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
            onAppointmentDeleted={onAppointmentDeleted}
          />
        ))}
      </ul>
    </div>
  );
};
