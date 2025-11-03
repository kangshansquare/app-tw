// components/DoughnutChart.js
import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  ArcElement,      // 必须注册 ArcElement 来渲染饼图/环状图
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = {
    className?: string;
    height?: number | string;
    options?: ChartOptions<'doughnut'>;
    data?: ChartData<'doughnut'>;
    title?: string;
}

export default function DoughnutChart({ className, height = '100%', options, data, title }: DoughnutChartProps) {
    const defaultData: ChartData<'doughnut'> = {
        labels: ['北京机房', '上海机房', '广州机房', '阿里云', '腾讯云'],
        datasets: [
            {
                label: "{机房}:{数量}台(百分比)",
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(90, 163, 163, 0.8)',
                    'rgba(205, 101, 219, 0.8)',
                    'rgba(92, 242, 122, 0.8)',
                    'rgba(255, 106, 0, 0.8)',
                    'rgba(0, 82, 217, 0.8)',
                ]
            }
        ]
    }

    const defaultOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: title ?? '机房服务器分布'
            }
        }
    }

    return (
        <div className={className} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
            <Doughnut data={data ?? defaultData} options={{ ...defaultOptions, ...(options ?? {}) }} />
        </div>
    )
}