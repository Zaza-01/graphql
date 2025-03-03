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

  // Round audit ratio to one decimal place
  const roundedRatio = Math.round(auditRatio * 10) / 10;

  // Correctly typed ApexCharts options
  const options: ApexOptions = {
    chart: {
      type: "bar", // Explicitly use 'bar' as the type
      height: 350,
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true, // Changed to false for vertical bars
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#fff'],
    xaxis: {
      categories: ["Done", "Received"],
      labels: {
        style: {
          colors: "#fff"
        },
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#fff"
        },
        // show: false
      }
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "14px" },
    },
  };

  const series = [
    {
      name: "Audit Counts",
      data: [totalUp, totalDown],
    },
  ];

  return (
    <div>
      <ApexCharts options={options} series={series} type="bar" height={200} width={500} />
      <div style={{ textAlign: "center", marginTop: "10px", fontSize: "16px" }}>
        <p className="font-title" style={{fontSize:'1.3em'}}>Audit Ratio: {roundedRatio}</p>
      </div>
    </div>
  );
};
