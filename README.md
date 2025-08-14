# PollyGlot - Gemini AI Translation App

PollyGlot is a modern translation application powered by Google's Gemini AI. Simple, fast, and completely free!

## ✨ Features

- 🤖 **Gemini AI Powered** - High-quality translations using Google's latest AI
- 🆓 **Completely Free** - No payment verification required
- 🌍 **Multi-language Support** - Translate to French, Spanish, and Japanese
- 🔄 **Smart Fallback** - Automatic backup service if Gemini is unavailable
- ⏱️ **Rate Limiting** - Built-in protection against API limits
- 🎨 **Beautiful UI** - Modern, responsive design with flag icons

## � Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Your Free Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API key in new project"
4. Copy the API key (starts with `AIza`)

### 3. Configure API Key
Add your API key to the `.env` file:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the App
```bash
npm run dev
```

Visit `http://localhost:5173` to use your translator!

## 🔧 How It Works

1. **Primary Service**: Gemini AI for high-quality translations
2. **Fallback Service**: LibreTranslate (free, no API key needed)
3. **Rate Limiting**: 2-second minimum between requests
4. **Error Handling**: Automatic fallback when services are unavailable

## 📊 API Limits

**Gemini AI Free Tier:**
- ✅ 15 requests per minute
- ✅ 1 million tokens per month  
- ✅ No payment verification required
- ✅ High-quality translations

**LibreTranslate Fallback:**
- ✅ Unlimited requests
- ✅ No API key required
- ✅ Always available backup

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Gemini AI** - Google's advanced language model
- **LibreTranslate** - Free backup translation service
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Application entry point
└── index.css        # Global styles
public/
├── parrot.png       # App logo
├── worldmap.png     # Banner background
├── fr-flag.png      # French flag
├── sp-flag.png      # Spanish flag
└── jpn-flag.png     # Japanese flag
```

## 🚨 Troubleshooting

### API Key Not Working?
- Make sure you copied the entire key (starts with `AIza`)
- Check that you saved the `.env` file
- Restart your development server

### Getting Rate Limit Errors?
- Wait a minute and try again
- The app enforces 2-second delays between requests

### Translation Failed?
- Check your internet connection
- The app will automatically try the backup service
- Gemini has very generous free limits

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security

- API key is stored securely in environment variables
- Protected by `.gitignore` to prevent accidental commits
- No sensitive data is logged or stored

## 📈 Performance

- Optimized for fast translations
- Automatic fallback ensures reliability
- Rate limiting prevents API abuse
- Minimal dependencies for fast loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check your Gemini API key is correct
2. Verify your internet connection
3. Try the backup service (works automatically)
4. Check the browser console for detailed error messages

**Need help getting a Gemini API key?** Visit [Google AI Studio](https://aistudio.google.com/) - it's completely free with no payment verification required!
