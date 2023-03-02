import React, { useEffect, useRef, useState } from 'react'
// import { Chart } from 'chart.js'
import Chart from 'chart.js/auto'

export default function LineChart(props) {
  const chartRef = useRef()
  const chartInstance = useRef()

  const config = {
    type: 'line',
    data: {
      labels: [
        'T1',
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'T11',
        'T12',
      ],
      datasets: [
        {
          label: '# Đơn hàng đã tạo',
          data: props.data,
          borderWidth: 1,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
        },
      ],
    },
    plugins: {
      legend: 'Đơn hàng theo tháng',
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  }
  useEffect(() => {
    chartInstance.current = new Chart(chartRef.current, config)
    return () => chartInstance.current.destroy()
  }, [])

  return (
    <div className="bg-white rounded shadow p-2">
      <canvas ref={chartRef} />
    </div>
  )
}
