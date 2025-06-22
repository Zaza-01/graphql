'use client';

import React, { use, useState } from "react";
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

  console.log(userEventId);
  

  const [selectedEvent, setSelectedEvent] = useState<number | "all">("all");

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
    xaxis: {
      categories: levels,
      axisTicks: { show: false },
      title: {
        text: "User Level",
        style: {
          color: "#fff",
          fontWeight: 600,
          fontFamily: "sans-serif",
        }
      },
      labels: { show: false }
    },
    yaxis: {
      axisTicks: {
        show: false
      },
      title: {
        text: "Number of Users", style: {
          color: "#fff",
          fontFamily: "sans-serif",
          fontWeight: 600,
        }
      }, 
      labels: { show: false }
    },
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
    <div id="barChartContainer" style={{ position: "relative" }}>
      {/* Inline Filter Buttons */}
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 999 }}>
        <button
          onClick={() => setSelectedEvent("all")}
          id="allButtonFilter"
          type="button"
          style={{
            background: selectedEvent === "all" ? "#272e38" : "#ddd",
            color: selectedEvent === "all" ? "#fff" : "#000",
            padding: "5px 10px",
            margin: "2px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#272e38";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = selectedEvent === "all" ? "#272e38" : "#ddd";
            e.currentTarget.style.color = selectedEvent === "all" ? "#fff" : "#000";
          }}
        >
          All
        </button>
        <button
          onClick={() => setSelectedEvent(userEventId)}
          className="yourCohortButtonFilter"
          type="button"
          style={{
            background: selectedEvent === userEventId ? "#272e38" : "#ddd",
            color: selectedEvent === userEventId ? "#fff" : "#000",
            padding: "5px 10px",
            margin: "2px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderRadius: "5px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#272e38";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = selectedEvent === userEventId ? "#272e38" : "#ddd";
            e.currentTarget.style.color = selectedEvent === userEventId ? "#fff" : "#000";
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
