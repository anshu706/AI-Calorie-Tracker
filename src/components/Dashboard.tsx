import React from 'react';
import { Ring } from './Rings';
import { useAppStore } from '../store';
import { Droplets } from 'lucide-react';

export function Dashboard() {
  const { user, getTodayTotals, getTodayWater, setWater } = useAppStore();
  const totals = getTodayTotals();
  const water = getTodayWater();

  const calPercent = Math.min((totals.calories / user.daily_cal_goal) * 100, 100) || 0;
  const proPercent = Math.min((totals.protein_g / user.protein_goal_g) * 100, 100) || 0;
  const carPercent = Math.min((totals.carbs_g / user.carbs_goal_g) * 100, 100) || 0;
  const fatPercent = Math.min((totals.fat_g / user.fat_goal_g) * 100, 100) || 0;
  const waterCups = Math.floor(water / 8);

  return (
    <div className="flex-1 w-full max-w-lg mx-auto pb-24 overflow-y-auto">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Today</h1>
        <p className="text-gray-400 font-medium">Keep up the great work!</p>
      </div>

      {/* Main Rings */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative mb-12">
          <Ring 
            percentage={calPercent} 
            color="#4CAF50" 
            radius={110} 
            strokeWidth={14} 
            label="Calories"
            value={Math.round(totals.calories).toString()}
            subValue={`${Math.max(0, user.daily_cal_goal - totals.calories)} left`}
            trackColor="#1A1A1A"
          />
          
          {/* Small rings arranged around the main ring */}
          <div className="absolute -bottom-8 -left-4">
            <Ring percentage={proPercent} color="#2196F3" radius={40} strokeWidth={8} value={Math.round(totals.protein_g).toString()} label="PRO" trackColor="#1A1A1A" />
          </div>
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <Ring percentage={carPercent} color="#FF9800" radius={40} strokeWidth={8} value={Math.round(totals.carbs_g).toString()} label="CARB" trackColor="#1A1A1A" />
          </div>
          <div className="absolute -bottom-8 -right-4">
            <Ring percentage={fatPercent} color="#E91E63" radius={40} strokeWidth={8} value={Math.round(totals.fat_g).toString()} label="FAT" trackColor="#1A1A1A" />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 mt-10">
        
        {/* Streak Card */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{user.streak_count} Day Streak</h3>
              <p className="text-sm text-gray-400">Log a meal today to keep it going!</p>
            </div>
          </div>
        </div>

        {/* Water Tracking Widget */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Droplets className="text-blue-400" size={20} />
              <h3 className="text-white font-bold">Water</h3>
            </div>
            <span className="text-sm text-gray-400 font-medium">
              {water} / {user.water_goal_oz} oz
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            {[...Array(8)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setWater((waterCups > i ? waterCups - 1 : i + 1) * 8)}
                className={`w-8 h-10 rounded-lg border transition-all duration-300 ${
                  i < waterCups 
                    ? 'bg-[#2196F3] border-[#2196F3]' 
                    : 'bg-transparent border-[#2196F3]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
