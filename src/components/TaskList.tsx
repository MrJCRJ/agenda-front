import { Task } from "../types/appointment";
import { deleteTask, updateTask } from "../services/appointmentService";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  appointmentId: string;
  onTasksUpdated: (updatedTasks: Task[]) => void;
}

export const TaskList = ({
  tasks,
  appointmentId,
  onTasksUpdated,
}: TaskListProps) => {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    // Adicione esta verificação IMEDIATAMENTE
    console.log("IDs sendo usados:", {
      appointmentId,
      taskId,
      isSame: appointmentId === taskId, // Não devem ser iguais!
    });

    if (appointmentId === taskId) {
      console.error("ERRO CRÍTICO: taskId igual ao appointmentId");
      return;
    }

    setLoadingTaskId(taskId);
    setError(null);

    try {
      // Atualização otimista
      const optimisticTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, completed } : task
      );
      onTasksUpdated(optimisticTasks);

      // Chamada API
      const updatedAppointment = await updateTask(appointmentId, taskId, {
        completed,
      });

      // Verificação de tipo segura
      if (!updatedAppointment?.tasks) {
        throw new Error("Invalid response from server");
      }

      // Atualização confirmada
      onTasksUpdated(updatedAppointment.tasks);
    } catch (error: unknown) {
      // Reverter para estado anterior em caso de erro
      onTasksUpdated(tasks);

      const message = error instanceof Error ? error.message : "Update failed";
      setError(message);
      console.error("Task update error:", {
        appointmentId,
        taskId,
        error: message,
      });
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoadingTaskId(taskId);
    setError(null);

    try {
      // Atualização otimista
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      onTasksUpdated(updatedTasks);

      // Chamada API com tratamento específico
      const response = await deleteTask(appointmentId, taskId);

      if (!response || !response.tasks) {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to delete task: ${error.message}`);
      } else {
        setError("Failed to delete task");
      }
      console.error("Deletion error:", error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-6">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add tasks to this appointment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => {
          if (!task._id) {
            console.error("Task without ID:", task);
            return null;
          }

          return (
            <li
              key={task._id}
              className="py-3 px-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center min-w-0 flex-1">
                  {loadingTaskId === task._id ? (
                    <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={(e) =>
                        handleTaskCompletion(task._id ?? "", e.target.checked)
                      }
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                      disabled={loadingTaskId !== null}
                    />
                  )}
                  <span
                    className={`ml-3 text-base truncate ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                    title={task.description}
                  >
                    {task.description}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteTask(task._id ?? "")}
                  disabled={loadingTaskId !== null}
                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Delete task"
                >
                  {loadingTaskId === task._id ? (
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
