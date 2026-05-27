import React from 'react';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export function Diary() {
  const { getTodayLogs, removeFoodLog, getTodayTotals, user } = useAppStore();
  const logs = getTodayLogs();
  const totals = getTodayTotals();

  const meals = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  return (
    <div className="flex-1 w-full max-w-lg mx-auto pb-24">
      <div className="px-6 pt-10 pb-6 bg-[#0A0A0A] sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-white mb-2">Diary</h1>
        <p className="text-gray-400 font-medium">{format(new Date(), 'EEEE, MMMM do')}</p>
        
        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-white">{Math.round(totals.calories)}</span>
            <span className="text-gray-400 font-medium ml-2">/ {user.daily_cal_goal} kcal</span>
          </div>
          <div className="flex space-x-2">
             <div className="w-2 h-10 bg-[#1A1A1A] rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-blue-500 w-full" style={{ height: `${Math.min(totals.protein_g / user.protein_goal_g * 100, 100)}%` }}></div>
             </div>
             <div className="w-2 h-10 bg-[#1A1A1A] rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-orange-500 w-full" style={{ height: `${Math.min(totals.carbs_g / user.carbs_goal_g * 100, 100)}%` }}></div>
             </div>
             <div className="w-2 h-10 bg-[#1A1A1A] rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-pink-500 w-full" style={{ height: `${Math.min(totals.fat_g / user.fat_goal_g * 100, 100)}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 mt-4">
        {meals.map(meal => {
          const mealLogs = logs.filter(l => l.meal_type === meal);
          const mealCalories = mealLogs.reduce((acc, log) => acc + log.totals.calories, 0);

          return (
            <div key={meal} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#2A2A2A] flex justify-between items-center bg-[#151515]">
                <h3 className="text-white font-bold capitalize">{meal}</h3>
                <span className="text-gray-400 font-medium text-sm">{Math.round(mealCalories)} kcal</span>
              </div>
              
              <div className="divide-y divide-[#2A2A2A]">
                {mealLogs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No items logged for {meal} yet.
                  </div>
                ) : (
                  mealLogs.map(log => (
                    <div key={log.id} className="p-4 flex items-center group">
                      {log.imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#2A2A2A] mr-4">
                          <img src={log.imageUrl} alt={log.meal_name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#2A2A2A] mr-4 flex items-center justify-center text-xl shrink-0">
                          🍽️
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-white font-medium truncate">{log.meal_name}</h4>
                          <span className="text-white font-bold ml-2 shrink-0">{Math.round(log.totals.calories)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {Math.round(log.totals.protein_g)}P · {Math.round(log.totals.carbs_g)}C · {Math.round(log.totals.fat_g)}F
                        </p>
                      </div>

                      <button 
                        onClick={() => removeFoodLog(log.id)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
