"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,

} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)



export function Overview({ chartType, timeRange }) {
  const [chartData, setChartData] = useState({
    datasets: [],
  })
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    // Generate labels based on time range
    const labels = []
    const currentDate = new Date()

    switch (timeRange) {
      case "week":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(currentDate.getDate() - i)
          labels.push(date.toLocaleDateString("en-US", { weekday: "short" }))
        }
        break
      case "month":
        // Last 30 days, grouped by week
        for (let i = 4; i >= 0; i--) {
          const date = new Date()
          date.setDate(currentDate.getDate() - i * 7)
          labels.push(`Week ${4 - i + 1}`)
        }
        break
      case "sixMonths":
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(currentDate.getMonth() - i)
          labels.push(date.toLocaleDateString("en-US", { month: "short" }))
        }
        break
      case "year":
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date()
          date.setMonth(currentDate.getMonth() - i)
          labels.push(date.toLocaleDateString("en-US", { month: "short" }))
        }
        break
    }

    // Generate random data based on chart type and time range
    const generateRandomData = (min, max, count) => {
      return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min))
    }

    let primaryData = []
    let secondaryData = []

    if (chartType === "orders") {
      // Order data tends to be higher numbers
      switch (timeRange) {
        case "week":
          primaryData = generateRandomData(50, 150, 7)
          secondaryData = generateRandomData(30, 100, 7)
          break
        case "month":
          primaryData = generateRandomData(200, 500, 5)
          secondaryData = generateRandomData(150, 400, 5)
          break
        case "sixMonths":
          primaryData = generateRandomData(800, 1500, 6)
          secondaryData = generateRandomData(600, 1200, 6)
          break
        case "year":
          primaryData = generateRandomData(1000, 2500, 12)
          secondaryData = generateRandomData(800, 2000, 12)
          break
      }
    } else {
      // Customer registration data tends to be lower numbers
      switch (timeRange) {
        case "week":
          primaryData = generateRandomData(10, 50, 7)
          secondaryData = generateRandomData(5, 30, 7)
          break
        case "month":
          primaryData = generateRandomData(50, 150, 5)
          secondaryData = generateRandomData(30, 100, 5)
          break
        case "sixMonths":
          primaryData = generateRandomData(200, 500, 6)
          secondaryData = generateRandomData(150, 350, 6)
          break
        case "year":
          primaryData = generateRandomData(300, 800, 12)
          secondaryData = generateRandomData(200, 600, 12)
          break
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: chartType === "orders" ? "Total Orders" : "New Registrations",
          data: primaryData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
        },
        {
          label: chartType === "orders" ? "Completed Orders" : "Active Users",
          data: secondaryData,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.3,
        },
      ],
    })

    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      maintainAspectRatio: false,
    })
  }, [chartType, timeRange])

  return (
    <div className="h-[350px]">
      <Line options={chartOptions} data={chartData} />
    </div>
  )
}
