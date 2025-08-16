const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    const apiKey = process.env.GEMINI_API_KEY; // Remove VITE_ prefix
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (!apiKey.startsWith('AIza')) {
      return res.status(500).json({ error: 'Invalid API key format' });
    }

    const prompt = `Translate the following text to ${targetLanguage}. Only return the translation, no explanations:\n\n"${text}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ error: `Gemini API error: ${errorData.error?.message || 'Request failed'}` });
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!translatedText) {
      return res.status(500).json({ error: 'No translation received from Gemini' });
    }

    res.json({ translation: translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
