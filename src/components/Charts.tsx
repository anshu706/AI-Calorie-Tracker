import React, { useMemo } from 'react';
import { useAppStore } from '../store';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function Charts() {
  const { foodLogs, user } = useAppStore();

  const data = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const logs = foodLogs.filter(l => l.date === dateStr);
      const calories = logs.reduce((sum, l) => sum + l.totals.calories, 0);
      days.push({
        name: format(date, 'EEE'), // Mon, Tue
        calories: Math.round(calories),
        date: dateStr,
      });
    }
    return days;
  }, [foodLogs]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs font-bold mb-1">{label}</p>
          <p className="text-white font-bold">{payload[0].value} kcal</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto pb-24">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">History</h1>
        <p className="text-gray-400 font-medium">Your 7-day overview</p>
      </div>

      <div className="px-6 mt-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
          <h3 className="text-white font-bold mb-6">Calories</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip cursor={{ fill: '#2A2A2A' }} content={<CustomTooltip />} />
                <ReferenceLine y={user.daily_cal_goal} stroke="#4CAF50" strokeDasharray="3 3" />
                <Bar 
                  dataKey="calories" 
                  radius={[4, 4, 0, 0]} 
                  fill="#4CAF50" 
                  background={{ fill: '#2A2A2A' }}
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const isOver = payload.calories > user.daily_cal_goal * 1.05;
                    const fill = isOver ? '#F44336' : '#4CAF50';
                    return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
            <p className="text-gray-400 text-sm font-medium mb-1">Avg Calories</p>
            <p className="text-2xl font-bold text-white">
              {Math.round(data.reduce((a, b) => a + b.calories, 0) / 7)}
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
            <p className="text-gray-400 text-sm font-medium mb-1">Goal Hits</p>
            <p className="text-2xl font-bold text-white">
              {data.filter(d => d.calories > 0 && d.calories <= user.daily_cal_goal * 1.05).length} / 7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
