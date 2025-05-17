export interface Appointment {
  _id?: string;
  title: string;
  start: string | Date;
  end: string | Date;
  isRecurring?: boolean;
  recurrenceRule?: string;
  recurrenceId?: string;
  originalStart?: string | Date;
  tasks?: Task[];
}

export interface Task {
  _id?: string;
  description: string;
  completed?: boolean;
}
export interface AppointmentDuration {
  hours: number;
  minutes: number;
  totalMinutes: number;
  formatted: string;
}

export interface GroupedAppointmentsResponse {
  title: string;
  totalDuration: AppointmentDuration;
  appointments: Appointment[];
}
