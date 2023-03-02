import React, { useEffect, useRef, useState } from 'react'
// import { Chart } from 'chart.js'
import Chart from 'chart.js/auto'

export default function PolaArea(props) {
  const chartRef = useRef()
  const chartInstance = useRef()

  const config = {
    type: 'polarArea',
    data: {
      labels: ['Chưa thanh toán', 'Đã thanh toán', 'Thất bại'],
      datasets: [
        {
          label: '# Đơn hàng đã thanh toán',
          data: [16, 9, 9],
          backgroundColor: [
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)',
            // 'rgb(201, 203, 207)',
            // 'rgb(54, 162, 235)',
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
