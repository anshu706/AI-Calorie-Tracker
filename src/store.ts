import { useState, useEffect } from 'react';
import { User, FoodLog, WaterLog } from './types';
import { format } from 'date-fns';

const STORAGE_KEYS = {
  USER: 'nutrisnap_user',
  FOOD_LOGS: 'nutrisnap_food_logs',
  WATER_LOGS: 'nutrisnap_water_logs',
};

const DEFAULT_USER: User = {
  id: 'user-1',
  name: 'Guest',
  goal: 'maintain',
  daily_cal_goal: 2000,
  protein_goal_g: 150,
  carbs_goal_g: 200,
  fat_goal_g: 65,
  streak_count: 0,
  water_goal_oz: 64,
};

export function useAppStore() {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [foodLogs, setFoodLogs] = useState<FoodLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(waterLogs));
  }, [waterLogs]);

  const addFoodLog = (log: FoodLog) => {
    setFoodLogs(prev => [...prev, log]);
  };

  const removeFoodLog = (logId: string) => {
    setFoodLogs(prev => prev.filter(l => l.id !== logId));
  };

  const updateFoodLog = (logId: string, updatedLog: FoodLog) => {
    setFoodLogs(prev => prev.map(l => l.id === logId ? updatedLog : l));
  };

  const getTodayLogs = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return foodLogs.filter(log => log.date === today);
  };

  const getTodayTotals = () => {
    const logs = getTodayLogs();
    return logs.reduce((acc, log) => ({
      calories: acc.calories + log.totals.calories,
      protein_g: acc.protein_g + log.totals.protein_g,
      carbs_g: acc.carbs_g + log.totals.carbs_g,
      fat_g: acc.fat_g + log.totals.fat_g,
      fiber_g: acc.fiber_g + log.totals.fiber_g,
      sodium_mg: acc.sodium_mg + log.totals.sodium_mg,
    }), {
      calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, sodium_mg: 0
    });
  };

  const getTodayWater = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return waterLogs.filter(w => w.date === today).reduce((acc, w) => acc + w.amount_oz, 0);
  };

  const setWater = (amount: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setWaterLogs(prev => {
      const otherDays = prev.filter(w => w.date !== today);
      return [...otherDays, { id: Date.now().toString(), date: today, amount_oz: amount }];
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return {
    user,
    foodLogs,
    waterLogs,
    addFoodLog,
    removeFoodLog,
    updateFoodLog,
    getTodayLogs,
    getTodayTotals,
    getTodayWater,
    setWater,
    updateUser
  };
}
