import {
  DateFilter,
  DateFilterKey,
  GroupedAppointmentsResponse,
} from "./types";

import { ChartOptions } from "chart.js";

export const adjustToLocalTimezone = (date: Date): Date => {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset);
};

export const getSunday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return adjustToLocalTimezone(new Date(date.setDate(diff)));
};

export const createDateFilters = (): Record<DateFilterKey, DateFilter> => {
  const today = adjustToLocalTimezone(new Date());
  const todayStr = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const weekStart = getSunday(new Date(today));
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = adjustToLocalTimezone(weekEnd).toISOString().split("T")[0];

  const monthStart = adjustToLocalTimezone(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const monthStartStr = monthStart.toISOString().split("T")[0];

  const monthEnd = adjustToLocalTimezone(
    new Date(today.getFullYear(), today.getMonth() + 1, 1)
  );
  const monthEndStr = monthEnd.toISOString().split("T")[0];

  return {
    today: { label: "Hoje", startDate: todayStr, endDate: tomorrowStr },
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
    all: { label: "Todos", startDate: "1970-01-01", endDate: "2100-12-31" },
  };
};

export const prepareChartData = (
  data: GroupedAppointmentsResponse[],
  maxItems: number
) => {
  const sortedData = [...data]
    .sort((a, b) => b.totalDuration.totalMinutes - a.totalDuration.totalMinutes)
    .slice(0, maxItems);

  return {
    labels: sortedData.map((group) => group.title),
    datasets: [
      {
        label: "Duration (minutes)",
        data: sortedData.map((group) => group.totalDuration.totalMinutes),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f97316",
        ],
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };
};

export const getChartOptions = (): ChartOptions<"bar"> => ({
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
        font: { size: 14 },
      },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const value = context.parsed.x;
          const hours = Math.floor(value / 60);
          const mins = value % 60;
          return `${label}: ${hours}h ${mins}m`;
        },
      },
      displayColors: false,
      backgroundColor: "#1f2937",
      bodyFont: { size: 12 },
      padding: 12,
    },
  },
});
