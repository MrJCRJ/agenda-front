import fetchApi from "./api";
import { Appointment, Task } from "../types/appointment";

const APPOINTMENTS_ENDPOINT = "/appointments";

type AppointmentCreate = Omit<Appointment, "_id" | "createdAt" | "updatedAt">;
type AppointmentUpdate = Partial<AppointmentCreate>;
type TaskCreate = Omit<Task, "_id">;
type TaskUpdate = Partial<TaskCreate>;

interface DeleteResponse {
  message: string;
  deletedCount: number;
}

interface RecurrenceQueryParams {
  recurrenceId?: string;
  startDate?: string;
  endDate?: string;
}

interface TaskResponse extends Task {
  createdAt?: string;
  updatedAt?: string;
}

// Helper para garantir o formato das tasks
const ensureTaskFormat = (task: TaskResponse): Task => ({
  _id: task._id,
  description: task.description,
  completed: task.completed,
  ...(task.createdAt && { createdAt: task.createdAt }),
  ...(task.updatedAt && { updatedAt: task.updatedAt }),
});

export const createAppointment = async (
  appointment: AppointmentCreate
): Promise<Appointment> => {
  return fetchApi<Appointment>(APPOINTMENTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(appointment),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAppointments = async (
  queryParams?: RecurrenceQueryParams | string
): Promise<Appointment[]> => {
  let queryString = "";

  if (typeof queryParams === "string") {
    queryString = queryParams;
  } else if (queryParams) {
    const params = new URLSearchParams();
    if (queryParams.recurrenceId)
      params.append("recurrenceId", queryParams.recurrenceId);
    if (queryParams.startDate)
      params.append("startDate", queryParams.startDate);
    if (queryParams.endDate) params.append("endDate", queryParams.endDate);
    queryString = params.toString();
  }

  const endpoint = queryString
    ? `${APPOINTMENTS_ENDPOINT}?${queryString}`
    : APPOINTMENTS_ENDPOINT;

  return fetchApi<Appointment[]>(endpoint);
};

export const getAppointment = async (id: string): Promise<Appointment> => {
  return fetchApi<Appointment>(`${APPOINTMENTS_ENDPOINT}/${id}`);
};

export const updateAppointment = async (
  id: string,
  appointment: AppointmentUpdate
): Promise<Appointment> => {
  return fetchApi<Appointment>(`${APPOINTMENTS_ENDPOINT}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(appointment),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteAppointment = async (
  id: string,
  allRecurring: boolean = false
): Promise<DeleteResponse> => {
  const endpoint = allRecurring
    ? `${APPOINTMENTS_ENDPOINT}/${id}?allRecurring=true`
    : `${APPOINTMENTS_ENDPOINT}/${id}`;

  return fetchApi<DeleteResponse>(endpoint, {
    method: "DELETE",
  });
};

export const addTask = async (
  appointmentId: string,
  task: TaskCreate
): Promise<Task> => {
  const response = await fetchApi<TaskResponse>(
    `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify({
        ...task,
        completed: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return ensureTaskFormat(response);
};

export const updateTask = async (
  appointmentId: string,
  taskId: string,
  task: TaskUpdate
): Promise<Task> => {
  console.log("Enviando atualização de tarefa:", {
    appointmentId,
    taskId,
    task,
  });

  try {
    const response = await fetchApi<TaskResponse>(
      `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          completed: task.completed,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Resposta da atualização:", response);

    if (!response?._id) {
      throw new Error("Resposta inválida do servidor");
    }

    return ensureTaskFormat(response);
  } catch (error) {
    console.error("Erro completo na atualização:", error);
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error("Erro de conexão. Verifique sua internet.");
    }
    throw new Error(`Falha ao atualizar tarefa: ${error}`);
  }
};

export const deleteTask = async (
  appointmentId: string,
  taskId: string
): Promise<DeleteResponse> => {
  return fetchApi<DeleteResponse>(
    `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
};

export const getTask = async (
  appointmentId: string,
  taskId: string
): Promise<Task> => {
  const response = await fetchApi<TaskResponse>(
    `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`
  );
  return ensureTaskFormat(response);
};

export const applyRecurrenceRule = async (
  appointmentId: string,
  rule: string
): Promise<Appointment[]> => {
  return fetchApi<Appointment[]>(
    `${APPOINTMENTS_ENDPOINT}/${appointmentId}/recurrence`,
    {
      method: "POST",
      body: JSON.stringify({ rule }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
