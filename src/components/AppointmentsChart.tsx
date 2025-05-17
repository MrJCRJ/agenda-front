import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Appointment, GroupedAppointmentsResponse } from "../types/appointment";
import { useEffect, useState } from "react";
import { getAppointmentsGroupedByTitle } from "../services/appointmentService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type DateFilter = {
  label: string;
  startDate: string;
  endDate: string;
};

interface AppointmentsChartProps {
  appointments: Appointment[];
  maxItems?: number;
}

export const AppointmentsChart = ({
  appointments,
  maxItems = 8,
}: AppointmentsChartProps) => {
  const [groupedData, setGroupedData] = useState<GroupedAppointmentsResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Adicione esta função utilitária no início do arquivo
  const adjustToLocalTimezone = (date: Date): Date => {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset);
  };

  // Modifique a parte onde você define as datas de filtro
  const today = adjustToLocalTimezone(new Date());
  const todayStr = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Filtro Semana: Domingo ao próximo Domingo
  const getSunday = (date: Date) => {
    const day = date.getDay(); // 0 = Domingo
    const diff = date.getDate() - day;
    return adjustToLocalTimezone(new Date(date.setDate(diff)));
  };

  const weekStart = getSunday(new Date(today));
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = adjustToLocalTimezone(weekEnd).toISOString().split("T")[0];

  // Filtro Mês: Dia 1 ao dia 1 do próximo mês
  const monthStart = adjustToLocalTimezone(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const monthStartStr = monthStart.toISOString().split("T")[0];

  const monthEnd = adjustToLocalTimezone(
    new Date(today.getFullYear(), today.getMonth() + 1, 1)
  );
  const monthEndStr = monthEnd.toISOString().split("T")[0];

  // Filtros atualizados
  const dateFilters: Record<string, DateFilter> = {
    today: {
      label: "Hoje",
      startDate: todayStr,
      endDate: tomorrowStr,
    },
    week: {
      label: "Esta Semana",
      startDate: weekStartStr,
      endDate: weekEndStr,
    },
    month: {
      label: "Este Mês",
      startDate: monthStartStr,
      endDate: monthEndStr,
    },
    all: {
      label: "Todos",
      startDate: "1970-01-01",
      endDate: "2100-12-31",
    },
  };

  const [dateFilter, setDateFilter] =
    useState<keyof typeof dateFilters>("today");

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
  }, [appointments, dateFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 h-[400px] flex items-center justify-center">
        <p className="text-red-700">{error}</p>
      </div>
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
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 h-[400px] flex flex-col items-center justify-center">
        <p className="text-yellow-700">Dados de tempo não disponíveis</p>
        <div className="mt-4 flex space-x-2">
          {Object.entries(dateFilters).map(([key, filter]) => (
            <button
              key={key}
              onClick={() => setDateFilter(key)}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Ordena e limita os dados
  const sortedData = [...groupedData]
    .sort((a, b) => b.totalDuration.totalMinutes - a.totalDuration.totalMinutes)
    .slice(0, maxItems);

  // Prepara os dados para o gráfico
  const chartData = {
    labels: sortedData.map((group) => group.title),
    datasets: [
      {
        label: "Duration (minutes)",
        data: sortedData.map((group) => group.totalDuration.totalMinutes),
        backgroundColor: [
          "#3b82f6", // blue
          "#10b981", // green
          "#f59e0b", // yellow
          "#ef4444", // red
          "#8b5cf6", // purple
          "#ec4899", // pink
          "#14b8a6", // teal
          "#f97316", // orange
        ],
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number) {
            const value =
              typeof tickValue === "string" ? parseFloat(tickValue) : tickValue;
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            return `${hours}h${mins > 0 ? mins + "m" : ""}`;
          },
        },
      },
      y: {
        ticks: {
          color: "#4b5563",
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const group = sortedData[context.dataIndex];
            return [
              `Compromissos: ${group.appointments.length}`,
              `Total: ${group.totalDuration.hours}h ${group.totalDuration.minutes}m`,
            ];
          },
        },
        displayColors: false,
        backgroundColor: "#1f2937",
        bodyFont: {
          size: 12,
        },
        padding: 12,
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Distribuição de Tempo
        </h2>
        <div className="flex space-x-2">
          {Object.entries(dateFilters).map(([key, filter]) => (
            <button
              key={key}
              onClick={() => setDateFilter(key)}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[400px] w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
