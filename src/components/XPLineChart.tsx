'use client';

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts with SSR disabled
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Transaction {
  amount: number;
  path: string;
  createdAt: string;
}

interface XPChartProps {
  data: Transaction[];
}

// Convert XP amount to readable "bits" (KB, MB, GB)
const formatBits = (xp: number): string => {
  if (xp >= 1_000_000_000) return `${(xp / 1_000_000_000).toFixed(2)} GB`;
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(2)} MB`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(2)} KB`;
  return `${xp} B`;
};

export const XPLineChart: React.FC<XPChartProps> = ({ data }) => {
  const [chartSeries, setChartSeries] = useState<{ x: number; y: number; project: string; amount: number }[]>([]);
  const [maxXP, setMaxXP] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("No data available for the chart.");
      return;
    }

    const sortedTransactions = [...data].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let cumulativeXP = 0;
    const formattedData = sortedTransactions.map((t) => {
      cumulativeXP += t.amount;
      const projectName = t.path.split("/").pop() || "Unknown Project";
      return {
        x: new Date(t.createdAt).getTime(),
        y: cumulativeXP,
        project: projectName,
        amount: t.amount,
      };
    });

    console.log("✅ Formatted Chart Data:", formattedData);

    const adjustedData = adjustDuplicateDates(formattedData);

    setChartSeries(adjustedData);
    setMaxXP(cumulativeXP);
  }, [data]);

  const adjustDuplicateDates = (data: { x: number; y: number; project: string; amount: number }[]) => {
    const dateCounts: { [key: string]: number } = {};
    return data.map((point) => {
      const dateString = new Date(point.x).toISOString().split("T")[0];
      if (dateCounts[dateString]) {
        dateCounts[dateString] += 1;
        return {
          ...point,
          x: point.x + dateCounts[dateString] * 1000 * 60 * 60,
        };
      } else {
        dateCounts[dateString] = 1;
        return point;
      }
    });
  };

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "#151b22", //chart background color
    },
    xaxis: {
      type: "datetime",
      labels: { 
        show: false,
      },
      axisTicks: { show: false },
      axisBorder: { show: true },
    },
    yaxis: {
      min: 0,
      max: maxXP * 1.1,
      tickAmount: 5,
      labels: { 
        show: false,
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    grid: { 
      show: false, 
      borderColor: "#222" 
    },
    tooltip: {
      theme: "dark",
      custom: ({ dataPointIndex }) => {
        const point = chartSeries[dataPointIndex];
        return `
          <div style="padding: 8px; background: #222; border-radius: 5px; color: #fff;">
            <strong>${new Date(point.x).toISOString().split("T")[0]}</strong><br/>
            Project: ${point.project}<br/>
            XP Gained: ${formatBits(point.amount)}<br/>
            Cumulative XP: ${formatBits(point.y)}
          </div>
        `;
      },
    },
    stroke: {
      curve: "stepline",
      width: 3,
    },
    markers: {
      size: 3,
      colors: ["#fff"], //marker color
      strokeWidth: 2,
      hover: { size: 5 },
    },
    dataLabels: { enabled: false },
    colors: ["#fff"], //line color
  };

  return (
    <div id="XPLineChartContainer" style={{ backgroundColor: "#151b22", borderRadius: "8px", width: "100%" }}>
      {chartSeries.length > 0 ? (
        <ApexCharts 
          options={options} 
          series={[{ name: "Cumulative XP", data: chartSeries }]} 
          type="line" 
          height={350}
        />
      ) : (
        <p style={{ color: "#fff", textAlign: "center" }}>Loading XP data...</p>
      )}
    </div>
  );
};
