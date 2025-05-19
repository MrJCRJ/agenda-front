import { Appointment } from "../../types/appointment";
export interface DateFilter {
  label: string;
  startDate: string;
  endDate: string;
}

export type DateFilterKey = "today" | "week" | "month" | "all";

export interface AppointmentsChartProps {
  appointments: Appointment[];
  maxItems?: number;
  dateFilter: DateFilterKey;
  onFilterChange: (filter: DateFilterKey) => void;
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
