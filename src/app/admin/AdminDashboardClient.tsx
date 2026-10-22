"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type ChartDataPoint = {
  date: string;
  revenue: number;
};

export default function AdminDashboardClient({ chartData }: { chartData: ChartDataPoint[] }) {
  const formatXAxis = (tickItem: string) => {
    const d = new Date(tickItem);
    return `${d.getDate()} ${d.toLocaleString("th-TH", { month: "short" })}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#64748b", fontSize: 11 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(value) => `฿${value.toLocaleString()}`}
        />
        <Tooltip 
          formatter={(value) => [`฿${Number(value).toLocaleString()}`, "ยอดขาย"]}
          labelFormatter={(label) => new Date(label as string).toLocaleDateString("th-TH")}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
