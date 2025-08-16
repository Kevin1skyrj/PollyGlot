import React, { useState } from 'react'

// Server-side translation via Worker proxy
const translateWithWorker = async (text, targetLanguage) => {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      targetLanguage: targetLanguage
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Translation failed: ${errorData.error || 'Request failed'}`)
  }

  const data = await response.json()
  
  if (!data.translated) {
    throw new Error('No translation received from server')
  }
  
  return data.translated
}

// Simple fallback translation using LibreTranslate (completely free)
const fallbackTranslate = async (text, targetLanguage) => {
  const langCodes = {
    'French': 'fr',
    'Spanish': 'es', 
    'Japanese': 'ja'

  }
  
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: langCodes[targetLanguage] || 'fr',
      format: 'text'
    })
  })
  
  if (!response.ok) {
    throw new Error('Fallback translation failed')
  }
  
  const data = await response.json()
  return data.translatedText
}

export default function App() {
  const [inputText, setInputText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('French')
  const [translatedText, setTranslatedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastRequestTime, setLastRequestTime] = useState(0)

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    // Rate limiting: enforce minimum 2 seconds between requests
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    const minimumInterval = 2000

    if (timeSinceLastRequest < minimumInterval) {
      const waitTime = minimumInterval - timeSinceLastRequest
      setError(`⏰ Please wait ${Math.ceil(waitTime / 1000)} seconds before translating again`)
      return
    }

    setIsLoading(true)
    setError('')
    setTranslatedText('')
    setLastRequestTime(now)

    try {
      // Use server-side Worker proxy
      const translation = await translateWithWorker(inputText, selectedLanguage)
      setTranslatedText(translation)
      // Clear any previous errors on success
      setError('')
    } catch (err) {
      console.error('Worker translation error:', err)
      
      // Try fallback service
      try {
        const fallbackResult = await fallbackTranslate(inputText, selectedLanguage)
        setTranslatedText(fallbackResult)
        // Clear errors on successful fallback
        setError('')
      } catch (fallbackErr) {
        console.error('Fallback translation error:', fallbackErr)
        setError(`❌ Translation failed: ${err.message}. Please check your internet connection.`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        backgroundImage:
          `
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,1) 100%)
          `,
        backgroundSize: '48px 48px, 48px 48px, 100% 100%',
        backgroundBlendMode: 'normal, normal, multiply',
      }}
    >
      <div className="w-full max-w-md px-2">
        <div className="rounded-2xl shadow-2xl bg-white border-4 border-white p-0 overflow-hidden">
          {/* Banner with world map */}
          <div className="relative w-full h-28 md:h-32 lg:h-36 flex flex-col items-center justify-center bg-[#0a1a3c]">
            <img
              src="/worldmap.png"
              alt="World Map Banner"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-60 pointer-events-none select-none"
              style={{ zIndex: 0 }}
            />
            <div className="relative z-10 flex flex-col items-center pt-2">
              <img src="/parrot.png" alt="PollyGlot Logo" className="w-14 h-14 mb-1" />
              <h1 className="text-2xl md:text-3xl font-bold text-green-400 tracking-tight">PollyGlot</h1>
              <p className="text-xs text-white mt-1">Perfect Translation Every Time</p>
            </div>
          </div>
          <div className="border-2 border-[#0a1a3c] rounded-b-xl p-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-blue-700 mb-2 flex items-center">Text to translate <span className="ml-1">👇</span></h2>
              <textarea 
                className="w-full h-20 p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 resize-none" 
                placeholder="How are you?" 
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-blue-700 mb-2 flex items-center">Select language <span className="ml-1">👇</span></h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-gray-800 font-medium">
                  <input 
                    type="radio" 
                    name="lang" 
                    value="French"
                    checked={selectedLanguage === 'French'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="accent-blue-600" 
                  />
                  French <img src="/fr-flag.png" alt="French" className="w-6 h-4 inline-block" />
                </label>
                <label className="flex items-center gap-2 text-gray-800 font-medium">
                  <input 
                    type="radio" 
                    name="lang" 
                    value="Spanish"
                    checked={selectedLanguage === 'Spanish'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="accent-blue-600" 
                  />
                  Spanish <img src="/sp-flag.png" alt="Spanish" className="w-6 h-4 inline-block" />
                </label>
                <label className="flex items-center gap-2 text-gray-800 font-medium">
                  <input 
                    type="radio" 
                    name="lang" 
                    value="Japanese"
                    checked={selectedLanguage === 'Japanese'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="accent-blue-600" 
                  />
                  Japanese <img src="/jpn-flag.png" alt="Japanese" className="w-6 h-4 inline-block" />
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Translation Result */}
            {translatedText && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-green-700 mb-2">Translation:</h3>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-gray-800">
                  {translatedText}
                </div>
              </div>
            )}

            <button 
              onClick={handleTranslate}
              disabled={isLoading}
              className="w-full py-3 bg-blue-700 text-white font-bold rounded-lg text-lg shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
