import { ChartOptions } from "chart.js";

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
