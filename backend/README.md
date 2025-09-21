# TruthLens Backend API

Flask-based REST API for the TruthLens fact-checking application, powered by Google's Gemini AI.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Gemini API**
   Set your Google AI API key as an environment variable:
   ```bash
   export GOOGLE_API_KEY="your-api-key-here"
   ```
   
   Or on Windows:
   ```cmd
   set GOOGLE_API_KEY=your-api-key-here
   ```

3. **Run the Server**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /check-text
Analyzes text content for misinformation.

**Request:**
```json
{
  "text": "Your text to fact-check"
}
```

**Response:**
```json
{
  "isTrue": boolean,
  "confidence": number (0-100),
  "explanation": "Detailed analysis",
  "sources": [
    {
      "title": "Source Title",
      "url": "https://source-url.com",
      "domain": "source-domain.com"
    }
  ]
}
```

### POST /check-image
Analyzes uploaded images for manipulation or false context.

**Request:**
- Form data with 'image' field containing the image file

**Response:**
Same format as text analysis

### GET /health
Health check endpoint.

## Features

- **Text Analysis**: Detects misinformation tactics, emotional manipulation, and factual inaccuracies
- **Image Analysis**: Identifies visual manipulation, deepfakes, and misleading contexts
- **Educational Responses**: Provides detailed explanations and verification steps
- **CORS Enabled**: Ready for frontend integration
- **Error Handling**: Graceful error responses with fallback information