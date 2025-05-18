import { Appointment } from "../../types/appointment";

export type DateFilter = {
  label: string;
  startDate: string;
  endDate: string;
};

export type DateFilterKey = "today" | "week" | "month" | "all";

export interface AppointmentsChartProps {
  appointments: Appointment[];
  maxItems?: number;
}

export interface GroupedAppointmentsResponse {
  title: string;
  appointments: Appointment[];
  totalDuration: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
}
