# TruthLens - AI-Powered Fact Verification Platform

**TruthLens** is a cutting-edge fact-checking application that leverages Google's Gemini 2.0 AI to instantly verify the authenticity of text and images. Built for the modern digital age where misinformation spreads rapidly, TruthLens provides users with detailed, educational analysis to help them make informed decisions about the content they encounter.

![TruthLens Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Python](https://img.shields.io/badge/Python-3.8+-green) ![AI](https://img.shields.io/badge/AI-Gemini%202.0-purple)

## 🎯 Key Features

- **🔍 Dual Analysis Modes**: Supports both text and image fact-checking with specialized AI models
- **📊 Visual Probability Charts**: Beautiful, animated charts showing authenticity percentages (Genuine, Manipulated, Misleading Context)
- **📋 Detailed Breakdowns**: Comprehensive analysis including credibility assessment, identified issues, and verification steps
- **🎨 Modern UI**: Sleek dark theme with glass morphism effects and smooth animations
- **🔒 Security-First**: Rate limiting, input sanitization, and production-ready security measures
- **⚡ Real-time Processing**: Instant analysis with engaging loading animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Google AI API Key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/Divyanshkhilari/TruthLens.git
cd TruthLens
```

### 2. Setup Backend
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# 🔑 IMPORTANT: Set your Google AI API key
# Get your key from: https://makersuite.google.com/app/apikey
export GOOGLE_API_KEY="your-actual-api-key-here"
# On Windows: set GOOGLE_API_KEY=your-actual-api-key-here

# Start the development server
python start-dev.py
```

> ⚠️ **Security Note**: Never commit your API key to version control! The application will not start without a valid API key.

### 3. Setup Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:3000`

## 💡 Perfect For

- **📰 Journalists** verifying sources and claims
- **📱 Social media users** checking viral content  
- **🎓 Students** researching reliable information
- **👥 Anyone** wanting to combat misinformation

## 🔧 How It Works

### 🧠 AI-Powered Analysis
TruthLens uses Google's Gemini 2.0 Flash model to analyze content through:

**Text Analysis:**
- Detects misinformation tactics and emotional manipulation
- Identifies lack of credible sources and logical fallacies
- Provides percentage-based authenticity scores
- Offers step-by-step verification guidance

**Image Analysis:**
- Identifies AI-generated or manipulated images
- Detects visual inconsistencies and deepfake artifacts
- Analyzes contextual misuse of genuine images
- Suggests reverse image search and verification methods

### 🎨 User Experience
- **Visual Probability Charts**: Interactive charts showing authenticity breakdown
- **Detailed Analysis**: Comprehensive reports with actionable insights
- **Modern Interface**: Dark theme with smooth animations and glass effects
- **Security Features**: Rate limiting, input validation, and secure file handling

### API Endpoints

**Text Fact-Checking:**
```
POST /check-text
{
  "text": "Your text to fact-check"
}
```

**Image Fact-Checking:**
```
POST /check-image
FormData with 'image' field
```

**Response Format:**
```json
{
  "isTrue": boolean,
  "confidence": number (0-100),
  "explanation": "Detailed analysis",
  "sources": [...]
}
```

## 🎨 Design Features

- **Animated Background**: Dynamic gradient with floating elements
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Smooth Transitions**: Framer Motion animations throughout
- **Interactive Elements**: Hover effects and micro-interactions
- **Color-Coded Results**: Visual indicators for true/false/uncertain results
- **Progress Visualization**: Animated confidence bars and loading states

## 📱 Responsive Design

The UI is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen orientations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Dropzone** - Drag and drop file uploads
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API calls

## 🎯 Hackathon Ready

This UI is specifically designed for hackathon presentations:
- Eye-catching visual design that stands out
- Smooth, professional animations
- Intuitive user experience
- Easy to demo and explain
- Modular, maintainable code structure

## 🏗️ Project Structure

```
TruthLens/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── services/          # API integration
│   └── styles/            # CSS and styling
├── backend/               # Python Flask API
├── project_1.py          # Core AI analysis functions
├── app.py                # Flask application
├── start-dev.py          # Development server
└── SECURITY.md           # Security documentation
```

## 🚀 Production Deployment

### Frontend
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend
```bash
# Use the production server
python start-production.py
# Or deploy with Gunicorn
gunicorn --config gunicorn.conf.py app:app
```

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Sanitization**: Protects against XSS attacks
- **File Validation**: Secure image upload handling
- **CORS Protection**: Restricted cross-origin requests
- **Environment Variables**: Secure API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - Built for educational purposes and hackathon competitions.

## 🙏 Acknowledgments

- Google Gemini AI for powerful analysis capabilities
- React and Flask communities for excellent frameworks
- Open source contributors who make projects like this possible

---

**TruthLens** - Empowering digital citizens to navigate the information age with confidence. 🔍✨