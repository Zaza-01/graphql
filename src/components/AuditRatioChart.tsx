'use client';

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts with SSR disabled
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

// Define TypeScript types
interface GraphQLData {
  totalUp: number;
  totalDown: number;
  auditRatio: number;
}

interface ChartProps {
  data: GraphQLData;
}

// Audit Ratio Bar Chart
export const AuditRatioBarChart: React.FC<ChartProps> = ({ data }) => {
  const { totalUp, totalDown, auditRatio } = data;

  // Helper to format bytes
  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1000;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Round audit ratio to one decimal place
  const roundedRatio = Math.round(auditRatio * 10) / 10;

  // Correctly typed ApexCharts options
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#fff'],
    xaxis: {
      categories: ["Done", "Received"],
      labels: {
        style: { colors: "#fff" },
        show: false,
      },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#fff",
          fontSize: "1em",
        },
      },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "14px" },
      y: {
        formatter: (val: number) => formatBytes(val),
      },
    },
  };

  const series = [
    {
      name: "Audit Counts",
      data: [totalUp, totalDown],
    },
  ];

  return (
    <div id="AuditChartContainer">
      <div className="flex flex-col justify-center items-center" style={{ textAlign: "center", marginTop: "10px", fontSize: "16px" }}>
        <ApexCharts options={options} series={series} type="bar" />
        <p className="font-title">Audit Ratio: {roundedRatio}</p>
      </div>
    </div>
  );
};
