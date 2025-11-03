// components/PieChart.js
import { Pie } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
    className?: string;
    height?: number | string;
    options?: ChartOptions<'pie'>;
    data?: ChartData<'pie'>;
    title?: string
}

export default function PieChart({ className, height = '100%', options, data, title }: PieChartProps) {
    const defaultData: ChartData<'pie'> = {
        labels: ['物理机', '虚拟机', '云主机'],
        datasets: [
            {
                label: '{服务器类型}:{数量}台(百分比)',
                data: [30, 15, 25],
                backgroundColor: [
                    'rgba(8, 130, 32, 0.8)',
                    'rgba(237, 69, 31, 0.8)',
                    'rgba(173, 9, 143, 0.8)',
                ]
            }
        ]
    }

    const defaultOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: title ?? '服务器类型分布',
            },
        }
    }

    return (
        <div className={className} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
            <Pie data={data ?? defaultData} options={{ ...defaultOptions, ...(options ?? {}) }} />
        </div>
    )
}