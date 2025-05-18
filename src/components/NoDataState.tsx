import { DateFilter, DateFilterKey } from "./AppointmentsChart/types";
import { FilterButtons } from "./FilterButtons";

interface NoDataStateProps {
  dateFilters: Record<DateFilterKey, DateFilter>;
  dateFilter: DateFilterKey;
  setDateFilter: (key: DateFilterKey) => void;
}

export const NoDataState = ({
  dateFilters,
  dateFilter,
  setDateFilter,
}: NoDataStateProps) => (
  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 h-[400px] flex flex-col items-center justify-center">
    <p className="text-yellow-700">Dados de tempo não disponíveis</p>
    <FilterButtons
      dateFilters={dateFilters}
      currentFilter={dateFilter}
      onFilterChange={setDateFilter}
    />
  </div>
);
