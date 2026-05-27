import React from 'react';
import { useAppStore } from '../store';
import { Settings, Download, Trash2, ChevronRight } from 'lucide-react';

export function Profile() {
  const { user } = useAppStore();

  return (
    <div className="flex-1 w-full max-w-lg mx-auto pb-24 overflow-y-auto">
       <div className="px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-500/20">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-400 capitalize text-sm">{user.goal} · {user.daily_cal_goal} kcal</p>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">Goals</h3>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden divide-y divide-[#2A2A2A]">
            <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-[#222] transition-colors">
              <span className="text-white font-medium">Daily Calories</span>
              <div className="flex items-center text-gray-400 group-hover:text-white transition-colors">
                <span>{user.daily_cal_goal} kcal</span>
                <ChevronRight size={16} className="ml-2 opacity-50 text-gray-500" />
              </div>
            </div>
            <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-[#222] transition-colors">
              <span className="text-white font-medium">Protein</span>
              <div className="flex items-center text-gray-400 group-hover:text-white transition-colors">
                <span>{user.protein_goal_g}g</span>
                <ChevronRight size={16} className="ml-2 opacity-50 text-gray-500" />
              </div>
            </div>
            <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-[#222] transition-colors">
              <span className="text-white font-medium">Carbs</span>
              <div className="flex items-center text-gray-400 group-hover:text-white transition-colors">
                <span>{user.carbs_goal_g}g</span>
                <ChevronRight size={16} className="ml-2 opacity-50 text-gray-500" />
              </div>
            </div>
            <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-[#222] transition-colors">
              <span className="text-white font-medium">Fat</span>
              <div className="flex items-center text-gray-400 group-hover:text-white transition-colors">
                <span>{user.fat_goal_g}g</span>
                <ChevronRight size={16} className="ml-2 opacity-50 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">Data</h3>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden divide-y divide-[#2A2A2A]">
            <button className="w-full p-4 flex justify-start items-center space-x-3 hover:bg-[#222] transition-colors text-white font-medium">
              <Download size={18} className="text-gray-400" />
              <span>Export CSV</span>
            </button>
            <button className="w-full p-4 flex justify-start items-center space-x-3 hover:bg-red-500/10 transition-colors text-red-500 font-medium">
              <Trash2 size={18} />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
