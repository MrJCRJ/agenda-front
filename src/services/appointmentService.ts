import fetchApi from "./api";
import { Appointment, Task } from "../types/appointment";

const APPOINTMENTS_ENDPOINT = "/appointments";

type AppointmentCreate = Omit<Appointment, "_id" | "createdAt" | "updatedAt">;
type AppointmentUpdate = Partial<AppointmentCreate>;
type TaskCreate = Omit<Task, "_id">;

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

interface GroupedAppointmentsResponse {
  title: string;
  totalDuration: {
    hours: number;
    minutes: number;
    totalMinutes: number;
    formatted: string;
  };
  appointments: Appointment[];
}

interface DeleteTaskResponse {
  success: boolean;
  tasks: Task[]; // Adicione esta linha
  appointment?: Appointment;
}

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
  updateData: { completed: boolean }
): Promise<Appointment> => {
  try {
    // Adicione logs para depuração
    console.log("Updating task with ID:", {
      taskId,
      type: typeof taskId,
      appointmentId,
    });

    const response = await fetchApi<Appointment>(
      `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          completed: updateData.completed,
          // Garanta que o ID está no formato correto
          taskId: taskId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Verificação mais robusta
    if (!response?._id || !response.tasks) {
      console.error("Invalid server response", response);
      throw new Error("Invalid server response");
    }

    // Verifique se a task atualizada está na resposta
    const updatedTask = response.tasks.find((t) => t._id === taskId);
    if (!updatedTask) {
      console.error("Task not found in response", {
        expectedId: taskId,
        receivedIds: response.tasks.map((t) => t._id),
      });
      throw new Error("Task update not reflected in response");
    }

    return response;
  } catch (error) {
    console.error("Update task error:", {
      appointmentId,
      taskId,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};

export const getAppointmentsGroupedByTitle = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<GroupedAppointmentsResponse[]> => {
  let queryString = "";

  if (params) {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    queryString = searchParams.toString();
  }

  const endpoint = queryString
    ? `${APPOINTMENTS_ENDPOINT}/grouped-by-title?${queryString}`
    : `${APPOINTMENTS_ENDPOINT}/grouped-by-title`;

  try {
    const data = await fetchApi<GroupedAppointmentsResponse[]>(endpoint);

    if (!Array.isArray(data)) {
      throw new Error("Expected array response");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch grouped appointments:", error);
    return [];
  }
};

export const deleteTask = async (
  appointmentId: string,
  taskId: string
): Promise<DeleteTaskResponse> => {
  try {
    const response = await fetchApi<Appointment>(
      `${APPOINTMENTS_ENDPOINT}/${appointmentId}/tasks/${taskId}`,
      { method: "DELETE" }
    );

    if (!response?._id || !response.tasks) {
      throw new Error("Resposta inválida do servidor após deleção");
    }

    return {
      success: true,
      tasks: response.tasks, // Garante que tasks está incluído
      appointment: response,
    };
  } catch (error) {
    console.error("Erro na deleção:", error);
    throw error;
  }
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
