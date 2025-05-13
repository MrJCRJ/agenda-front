import fetchApi from "./api";
import { Appointment, Task } from "../types/appointment";

const APPOINTMENTS_ENDPOINT = "/appointments";

export const createAppointment = async (
  appointment: Omit<Appointment, "_id">
) => {
  return fetchApi<Appointment>(APPOINTMENTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(appointment),
  });
};

export const getAppointments = async (query?: string) => {
  const endpoint = query
    ? `${APPOINTMENTS_ENDPOINT}?${query}`
    : APPOINTMENTS_ENDPOINT;
  return fetchApi<Appointment[]>(endpoint);
};

export const getAppointment = async (id: string) => {
  return fetchApi<Appointment>(`${APPOINTMENTS_ENDPOINT}/${id}`);
};

export const updateAppointment = async (
  id: string,
  appointment: Partial<Appointment>
) => {
  return fetchApi<Appointment>(`${APPOINTMENTS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(appointment),
  });
};

export const deleteAppointment = async (id: string, allRecurring = false) => {
  const endpoint = allRecurring
    ? `${APPOINTMENTS_ENDPOINT}/${id}?allRecurring=true`
    : `${APPOINTMENTS_ENDPOINT}/${id}`;
  return fetchApi<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

export const addTask = async (
  appointmentId: string,
  task: Omit<Task, "_id">
) => {
  return fetchApi<Task>(`${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
};

export const updateTask = async (
  appointmentId: string,
  taskId: string,
  task: Partial<Task>
) => {
  return fetchApi<Task>(
    `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`,
    {
      method: "PUT",
      body: JSON.stringify(task),
    }
  );
};

export const deleteTask = async (appointmentId: string, taskId: string) => {
  return fetchApi<{ message: string }>(
    `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
};
