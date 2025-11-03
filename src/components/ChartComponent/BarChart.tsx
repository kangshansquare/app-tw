// components/BarChart.js
import { Bar } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 必须注册组件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = {
    className?: string;
    height?: number | string;
    options?: ChartOptions<'bar'>;
    data?: ChartData<'bar'>;
    title?: string;
    label?: string;
}

export default function BarChart({ className, height = '100%', options, data, title, label }: BarChartProps) {
    const defaultData: ChartData<'bar'> = {
        labels: ['北京机房', '上海机房', '广州机房', '阿里云', '腾讯云'],
        datasets: [
            {
                label: label ?? '服务器数量(台)',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(85, 65, 240, 0.8)',
                borderColor: 'rgba(85, 65, 240, 1)',
                borderWidth: 1,
            },
        ],
    }

    const defaultOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title ?? '机房/云平台服务器数量',
            },
        }
    }

    return (
        <div className={className} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
            <Bar data={data ?? defaultData} options={{ ...defaultOptions, ...(options ?? {}) }} />
        </div>
    )
}