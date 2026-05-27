export interface User {
  id: string;
  name: string;
  goal: 'lose' | 'maintain' | 'build';
  daily_cal_goal: number;
  protein_goal_g: number;
  carbs_goal_g: number;
  fat_goal_g: number;
  streak_count: number;
  water_goal_oz: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sodium_mg: number;
}

export interface FoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageUrl?: string;
  meal_name: string;
  confidence: 'high' | 'medium' | 'low';
  items: FoodItem[];
  totals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    sodium_mg: number;
  };
  created_at: number;
}

export interface WaterLog {
  id: string;
  date: string;
  amount_oz: number;
}
