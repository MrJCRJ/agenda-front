import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { GroupedAppointmentsResponse } from "../../types/appointment";
import { useEffect, useState, useMemo } from "react";
import { getAppointmentsGroupedByTitle } from "../../services/appointmentService";
import { FilterButtons } from "../FilterButtons";
import { ErrorMessage } from "../ui/ErrorMessage";
import { NoDataState } from "../NoDataState";
import { createDateFilters, prepareChartData, getChartOptions } from "./utils";
import { AppointmentsChartProps } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const AppointmentsChart = ({
  appointments,
  maxItems = 8,
  dateFilter,
  onFilterChange,
}: AppointmentsChartProps) => {
  const [groupedData, setGroupedData] = useState<GroupedAppointmentsResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateFilters = useMemo(() => createDateFilters(), []);

  useEffect(() => {
    const loadGroupedData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (appointments.length > 0) {
          const filter = dateFilters[dateFilter];
          const grouped = await getAppointmentsGroupedByTitle({
            startDate: filter.startDate,
            endDate: filter.endDate,
          });
          setGroupedData(grouped);
        } else {
          setGroupedData([]);
        }
      } catch (err) {
        setError("Falha ao carregar dados do gráfico");
        console.error("Error loading grouped data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupedData();
  }, [appointments, dateFilter, dateFilters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        className="h-[400px] flex items-center justify-center"
      />
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 h-[400px] flex items-center justify-center">
        <p className="text-blue-700">Nenhum compromisso agendado ainda</p>
      </div>
    );
  }

  if (groupedData.length === 0) {
    return (
      <NoDataState
        dateFilters={dateFilters}
        dateFilter={dateFilter}
        setDateFilter={onFilterChange}
      />
    );
  }

  const chartData = prepareChartData(groupedData, maxItems);
  const chartOptions = getChartOptions();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Distribuição de Tempo
        </h2>
        <FilterButtons
          dateFilters={dateFilters}
          currentFilter={dateFilter}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="h-[400px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
