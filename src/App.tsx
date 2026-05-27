import React, { useState } from 'react';
import { Home, BookOpen, Camera, BarChart2, User as UserIcon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Diary } from './components/Diary';
import { Scanner } from './components/Scanner';
import { Charts } from './components/Charts';
import { Profile } from './components/Profile';
import { useAppStore } from './store';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'diary' | 'progress' | 'profile'>('home');
  const [showScanner, setShowScanner] = useState(false);
  const { addFoodLog } = useAppStore();

  const handleLogSaved = (log: any) => {
    addFoodLog(log);
    setShowScanner(false);
    setActiveTab('diary'); // switch to diary after scan
  };

  return (
    <div className="relative w-full h-screen bg-[#0A0A0A] text-white flex flex-col font-sans overflow-hidden hidden-scrollbar">
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'diary' && <Diary />}
        {activeTab === 'progress' && <Charts />}
        {activeTab === 'profile' && <Profile />}
      </div>

      {/* Full UI Scanner Overlay */}
      {showScanner && (
        <Scanner 
          onLogSaved={handleLogSaved} 
          onCancel={() => setShowScanner(false)} 
        />
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full max-w-lg left-1/2 transform -translate-x-1/2 bg-[#0F0F0F] border-t border-[#1F1F1F] rounded-t-3xl pb-safe z-50">
        <div className="flex justify-between items-center px-6 h-20">
          
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 ${activeTab === 'home' ? 'text-[#4CAF50] opacity-100' : 'text-gray-400 opacity-50 hover:opacity-80'}`}
          >
            <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('diary')} 
            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 ${activeTab === 'diary' ? 'text-[#4CAF50] opacity-100' : 'text-gray-400 opacity-50 hover:opacity-80'}`}
          >
            <BookOpen size={24} strokeWidth={activeTab === 'diary' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Diary</span>
          </button>

          {/* Center Scan Button */}
          <div className="relative -top-8 flex items-center justify-center">
            <button 
              onClick={() => setShowScanner(true)}
              className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(76,175,80,0.3)] border-4 border-[#0A0A0A] hover:scale-105 transition-transform"
            >
              <Camera size={28} strokeWidth={2.5} />
            </button>
          </div>

          <button 
            onClick={() => setActiveTab('progress')} 
            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 ${activeTab === 'progress' ? 'text-[#4CAF50] opacity-100' : 'text-gray-400 opacity-50 hover:opacity-80'}`}
          >
            <BarChart2 size={24} strokeWidth={activeTab === 'progress' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Progress</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 ${activeTab === 'profile' ? 'text-[#4CAF50] opacity-100' : 'text-gray-400 opacity-50 hover:opacity-80'}`}
          >
            <UserIcon size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>

        </div>
      </div>
    </div>
  );
}
