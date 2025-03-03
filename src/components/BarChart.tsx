'use client';

import React, { useState } from "react";
import dynamic from "next/dynamic";

interface EventUser {
  level: string;
  userId: number;
  userLogin: string;
  eventId: number;
}

interface BarChartProps {
  data: EventUser[];
  userEventId: number,
}

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const BarChart: React.FC<BarChartProps> = ({ data, userEventId }) => {

  const [selectedEvent, setSelectedEvent] = useState<number | "all">("all");

  // const uniqueEventIds = Array.from(new Set(data.map((user) => user.eventId)));

  const filteredData =
    selectedEvent === "all" ? data : data.filter((user) => user.eventId === selectedEvent);

  const levelCounts: Record<string, number> = filteredData.reduce((acc, user) => {
    acc[user.level] = (acc[user.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levels = Object.keys(levelCounts);
  const counts = Object.values(levelCounts);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar", height: 350, toolbar: {
        show: false,
      }
    },
    xaxis: { categories: levels, axisTicks:{show:false}, title: { text: "User Level", style: {
      color: "#fff"
    }}, labels:{show: false}},
    yaxis: { axisTicks:{show:false}, title: { text: "Number of Users", style: {
      color: "#fff"
    }}, labels: {show: false} },
    colors: ["#fff"],
    plotOptions: { 
      bar: { 
        columnWidth: "50%", 
        borderRadius: 4 
      } 
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "14px" },
    },
    grid: { 
      show: false, 
    },
    dataLabels: {
      enabled: false,
    }
  };

  const series = [{ name: "Users", data: counts }];

  return (
    <div style={{ position: "relative" }}>
      {/* Inline Filter Buttons */}
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 999 }}>
        <button
          onClick={() => setSelectedEvent("all")}
          id="allButtonFilter"
          type="button"
          style={{
            background: selectedEvent === "all" ? "#000" : "#ddd",
            color: selectedEvent === "all" ? "#fff" : "#000",
            padding: "5px 10px",
            margin: "2px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            transition: "all 0.3s ease",
          }}
        >
          All
        </button>
        <button
          onClick={() => setSelectedEvent(userEventId)}
          className="yourCohortButtonFilter"
          type="button"
          style={{
            background: selectedEvent === userEventId ? "#000" : "#ddd",
            color: selectedEvent === userEventId ? "#fff" : "#000",
            padding: "5px 10px",
            margin: "2px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderRadius: "5px",
          }}
        >
          Your Cohort
        </button>
      </div>

      <ApexCharts options={options} series={series} type="bar" height={250} />
    </div>
  );
};

export default BarChart;