import { useState } from "react";

export const RecurrenceForm = ({
  onSave,
}: {
  onSave: (rule: string) => void;
}) => {
  const [rule, setRule] = useState("FREQ=WEEKLY;COUNT=3");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Recurrence Pattern</h3>
      <div className="flex items-center space-x-4">
        <select
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="FREQ=DAILY;COUNT=5">Daily (5 occurrences)</option>
          <option value="FREQ=WEEKLY;COUNT=3">Weekly (3 occurrences)</option>
          <option value="FREQ=MONTHLY;COUNT=6">Monthly (6 occurrences)</option>
        </select>

        <button
          onClick={() => onSave(rule)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Recurrence
        </button>
      </div>
    </div>
  );
};
