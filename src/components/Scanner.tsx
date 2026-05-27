import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { FoodLog } from '../types';

interface ScannerProps {
  onLogSaved: (log: FoodLog) => void;
  onCancel: () => void;
}

export function Scanner({ onLogSaved, onCancel }: ScannerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImageUri(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      // Convert to FoodLog format
      const newLog: FoodLog = {
        id: uuidv4(),
        date: format(new Date(), 'yyyy-MM-dd'),
        meal_type: 'snack', // Default, can be edited
        imageUrl: base64Image,
        meal_name: data.meal_name || 'Unknown Meal',
        confidence: data.confidence as any || 'low',
        items: data.items || [],
        totals: data.totals || { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, sodium_mg: 0 },
        created_at: Date.now()
      };
      
      setResult(newLog);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while analyzing the image.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      onLogSaved(result);
    }
  };

  if (result) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col p-4 animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Meal Analysis</h2>
          <button onClick={onCancel} className="p-2 bg-[#1A1A1A] rounded-full text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Result Card */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden mb-6">
            {imageUri && (
              <img src={imageUri} alt="Meal" className="w-full h-48 object-cover" />
            )}
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{result.meal_name}</h3>
                  <p className="text-sm text-gray-400">Confidence: <span className={result.confidence === 'high' ? 'text-green-400' : 'text-yellow-400'}>{result.confidence.toUpperCase()}</span></p>
                </div>
                <div className="bg-[#2A2A2A] px-3 py-1 rounded-lg">
                  <span className="text-xl font-bold text-white">🔥 {result.totals.calories}</span>
                  <span className="text-sm text-gray-400 ml-1">kcal</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-[#2A2A2A] p-2 rounded-xl border border-blue-500/20">
                  <p className="text-xl font-bold text-blue-400">{result.totals.protein_g}g</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Protein</p>
                </div>
                <div className="bg-[#2A2A2A] p-2 rounded-xl border border-orange-500/20">
                  <p className="text-xl font-bold text-orange-400">{result.totals.carbs_g}g</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Carbs</p>
                </div>
                <div className="bg-[#2A2A2A] p-2 rounded-xl border border-pink-500/20">
                  <p className="text-xl font-bold text-pink-400">{result.totals.fat_g}g</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Fat</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Item Breakdown</h4>
                <div className="space-y-3">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <span className="text-white font-medium block">{item.name}</span>
                        <span className="text-gray-500 text-xs">{item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium block">{item.calories} kcal</span>
                        <span className="text-gray-500 text-xs">{item.protein_g}P · {item.carbs_g}C · {item.fat_g}F</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-4 right-4 flex space-x-3">
          <button onClick={onCancel} className="flex-1 py-4 bg-[#2A2A2A] text-white rounded-full font-bold">
            Discard
          </button>
          <button onClick={handleSave} className="flex-1 py-4 bg-[#4CAF50] text-[#0A0A0A] rounded-full font-bold flex items-center justify-center space-x-2">
            <Check size={20} />
            <span>Log Meal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col p-6 animate-in slide-in-from-bottom">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Scan Meal</h2>
        <button onClick={onCancel} className="p-2 bg-[#1A1A1A] rounded-full text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
              <Camera size={40} className="text-green-400 relative z-10" />
            </div>
            <p className="text-gray-400 font-medium">Analyzing your meal...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 w-full">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}
            
            <div className="w-48 h-48 rounded-full bg-[#4CAF50] p-1 cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInputRef.current?.click()}>
              <div className="w-full h-full bg-[#0A0A0A] rounded-full flex flex-col items-center justify-center text-white space-y-2">
                <Camera size={48} />
                <span className="font-bold tracking-wide">Take Photo</span>
              </div>
            </div>

            <div className="text-center text-gray-400 font-medium">or</div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center justify-center space-x-3 text-white font-medium hover:bg-[#2A2A2A] transition-colors"
            >
              <Upload size={20} />
              <span>Upload from Gallery</span>
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleCapture}
            />
          </div>
        )}
      </div>
    </div>
  );
}
