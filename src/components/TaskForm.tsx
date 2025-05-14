import { useState } from "react";
import { Task } from "../types/appointment";
import { addTask } from "../services/appointmentService";

interface TaskFormProps {
  appointmentId: string;
  onTaskAdded: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  existingTask?: Task;
  resetForm?: () => void;
}

export const TaskForm = ({
  appointmentId,
  onTaskAdded,

  existingTask,
}: TaskFormProps) => {
  const [description, setDescription] = useState(
    existingTask?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Task description cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newTask = {
        description,
        completed: false,
      };

      const addedTask = await addTask(appointmentId, newTask);
      onTaskAdded({
        ...addedTask,
        description, // Garante que a descrição está presente
      });

      setDescription("");
    } catch (error) {
      setError("Failed to save task. Please try again.");
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label
          htmlFor="task-input"
          className="text-sm font-medium text-gray-700 block"
        >
          {existingTask?._id ? "Update Task" : "Add New Task"}
        </label>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <input
            id="task-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            required
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
              isSubmitting || !description.trim()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                {existingTask?._id ? "Updating..." : "Adding..."}
              </span>
            ) : existingTask?._id ? (
              "Update Task"
            ) : (
              "Add Task"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
    </form>
  );
};
