import { useState } from "react";

interface RecurrenceFormProps {
  onSave: (rule: string) => void;
  initialRule?: string;
}

export const RecurrenceForm = ({
  onSave,
  initialRule = "FREQ=WEEKLY;COUNT=3",
}: RecurrenceFormProps) => {
  const [rule, setRule] = useState(initialRule);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(rule);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const recurrenceOptions = [
    {
      value: "FREQ=DAILY;COUNT=5",
      label: "Daily (5 times)",
      description: "Every day for 5 days",
    },
    {
      value: "FREQ=WEEKLY;COUNT=3",
      label: "Weekly (3 times)",
      description: "Every week for 3 weeks",
    },
    {
      value: "FREQ=MONTHLY;COUNT=6",
      label: "Monthly (6 times)",
      description: "Every month for 6 months",
    },
    {
      value: "FREQ=YEARLY;COUNT=2",
      label: "Yearly (2 times)",
      description: "Every year for 2 years",
    },
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="text-base font-medium text-gray-800">
          Recurrence Settings
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Select how often this appointment should repeat
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label htmlFor="recurrence-pattern" className="sr-only">
            Recurrence pattern
          </label>
          <select
            id="recurrence-pattern"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
          >
            {recurrenceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {rule && (
            <p className="mt-2 text-xs text-gray-500">
              {recurrenceOptions.find((opt) => opt.value === rule)?.description}
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSaved
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaved ? (
            <>
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Recurrence Applied
            </>
          ) : (
            "Apply Recurrence"
          )}
        </button>
      </div>
    </div>
  );
};
