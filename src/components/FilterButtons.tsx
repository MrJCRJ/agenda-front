import { DateFilter, DateFilterKey } from "./AppointmentsChart/types";

interface FilterButtonsProps {
  dateFilters: Record<DateFilterKey, DateFilter>;
  currentFilter: DateFilterKey;
  onFilterChange: (key: DateFilterKey) => void;
}

export const FilterButtons = ({
  dateFilters,
  currentFilter,
  onFilterChange,
}: FilterButtonsProps) => (
  <div className="mt-4 flex space-x-2">
    {(Object.keys(dateFilters) as DateFilterKey[]).map((key) => (
      <button
        key={key}
        onClick={() => onFilterChange(key)}
        className={`px-3 py-1 rounded-md text-sm ${
          currentFilter === key
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {dateFilters[key].label}
      </button>
    ))}
  </div>
);
