import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/analyze-meal', async (req, res) => {
    try {
      const { image, textQuery } = req.body; // image should be base64 string without data uris
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      if (!image) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Strip data uri prefix if present
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      };

      const textPart = {
        text: textQuery || "Analyze this meal photo and identify every food item visible. Return ONLY a valid JSON object.",
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              meal_name: {
                type: Type.STRING,
                description: "Descriptive meal name, e.g. 'Grilled Chicken Caesar Salad'"
              },
              confidence: {
                type: Type.STRING,
                description: "'high' | 'medium' | 'low'",
              },
              serving_note: {
                type: Type.STRING,
                description: "e.g. 'Estimated ~1 plate / 350g'"
              },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING, description: "e.g. '1 cup', '2 slices', '1 medium'" },
                    calories: { type: Type.NUMBER },
                    protein_g: { type: Type.NUMBER },
                    carbs_g: { type: Type.NUMBER },
                    fat_g: { type: Type.NUMBER },
                    fiber_g: { type: Type.NUMBER },
                    sodium_mg: { type: Type.NUMBER },
                  },
                  required: ['name', 'quantity', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g', 'sodium_mg']
                }
              },
              totals: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.NUMBER },
                  protein_g: { type: Type.NUMBER },
                  carbs_g: { type: Type.NUMBER },
                  fat_g: { type: Type.NUMBER },
                  fiber_g: { type: Type.NUMBER },
                  sodium_mg: { type: Type.NUMBER },
                },
                required: ['calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g', 'sodium_mg']
              }
            },
            required: ['meal_name', 'confidence', 'serving_note', 'items', 'totals']
          }
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) {
        throw new Error("No response from Gemini");
      }
      
      const parsedData = JSON.parse(jsonStr);
      res.json(parsedData);
      
    } catch (error: any) {
      console.error('Error analyzing meal:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze meal' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
