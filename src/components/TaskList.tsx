import { Task } from "../types/appointment";
import { deleteTask, updateTask } from "../services/appointmentService";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  appointmentId: string;
  onTasksUpdated: () => void;
}

export const TaskList = ({
  tasks,
  appointmentId,
  onTasksUpdated,
}: TaskListProps) => {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      setLoadingTaskId(taskId);
      setError(null);

      console.log("Attempting to update:", { appointmentId, taskId });

      const updated = await updateTask(appointmentId, taskId, { completed });
      console.log("Update successful:", updated);

      onTasksUpdated();
    } catch (error) {
      console.error("Update failed:", error);
      setError(`Failed to update task: ${error}`);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoadingTaskId(taskId);
      setError(null);
      await deleteTask(appointmentId, taskId);
      onTasksUpdated();
    } catch (error) {
      setError(`Failed to delete task: ${error}`);
    } finally {
      setLoadingTaskId(null);
    }
  };

  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 py-4">No tasks for this appointment.</p>;
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-2">
          {error}
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => {
          if (!task._id) {
            console.error("Task without ID:", task);
            return null;
          }

          return (
            <li key={`${task._id}-${task.description}`} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  {loadingTaskId === task._id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-blue-500" />
                  ) : (
                    <input
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={(e) =>
                        handleTaskCompletion(task._id!, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={loadingTaskId !== null}
                    />
                  )}
                  <span
                    className={`text-sm truncate ${
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
                  onClick={() => handleDeleteTask(task._id!)}
                  disabled={loadingTaskId !== null}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {loadingTaskId === task._id ? (
                    <svg
                      className="animate-spin h-4 w-4 text-red-600"
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
