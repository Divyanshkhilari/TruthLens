from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import textwrap
from PIL import Image
import requests
from io import BytesIO
import os
import re
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Gemini API
genai.configure()

def analyze_text_for_misinformation(text: str):
    """Analyzes a given text for misinformation and provides a detailed breakdown."""
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = textwrap.dedent(f"""
    You are an AI-powered fact-checking tool. Analyze the following text and provide a JSON-structured response with these exact fields:

    {{
        "isTrue": boolean (true if likely accurate, false if likely false/misleading),
        "confidence": number (0-100, confidence in your assessment),
        "explanation": "Detailed analysis explaining your reasoning",
        "sources": [
            {{
                "title": "Source name",
                "url": "https://example.com",
                "domain": "example.com"
            }}
        ]
    }}

    Focus on:
    1. Factual accuracy based on known information
    2. Misinformation tactics (emotional language, lack of sources, etc.)
    3. Credibility assessment
    4. Provide educational explanation

    Text to analyze: {text}
    
    Respond ONLY with valid JSON:
    """)
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

def analyze_image_for_misinformation(image):
    """Analyzes an uploaded image for signs of manipulation or false context."""
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = textwrap.dedent("""
    You are an AI that helps identify manipulated or misleading images. Analyze the provided image and respond with a JSON-structured response with these exact fields:

    {
        "isTrue": boolean (true if likely genuine, false if likely manipulated/misleading),
        "confidence": number (0-100, confidence in your assessment),
        "explanation": "Detailed analysis of the image's credibility and any issues found",
        "sources": [
            {
                "title": "Verification method or source",
                "url": "https://example.com",
                "domain": "verification-site.com"
            }
        ]
    }

    Focus on:
    1. Visual inconsistencies or manipulation signs
    2. Contextual analysis (stock photo, historical image, etc.)
    3. Verification suggestions
    4. Educational explanation

    Respond ONLY with valid JSON:
    """)
    
    try:
        response = model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        return f"Error: {e}"

def parse_gemini_response(response_text):
    """Parse Gemini response and extract JSON, handling potential formatting issues."""
    try:
        # Try to find JSON in the response
        import json
        
        # Remove any markdown formatting
        cleaned_text = response_text.strip()
        if cleaned_text.startswith('```json'):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith('```'):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()
        
        # Try to parse as JSON
        result = json.loads(cleaned_text)
        
        # Validate required fields
        if not all(key in result for key in ['isTrue', 'confidence', 'explanation']):
            raise ValueError("Missing required fields")
            
        # Ensure sources is a list
        if 'sources' not in result:
            result['sources'] = []
            
        return result
        
    except (json.JSONDecodeError, ValueError) as e:
        # Fallback response if JSON parsing fails
        return {
            "isTrue": False,
            "confidence": 50,
            "explanation": f"Analysis completed but response formatting error occurred. Raw response: {response_text[:500]}...",
            "sources": []
        }

@app.route('/check-text', methods=['POST'])
def check_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Empty text provided'}), 400
        
        # Analyze the text
        raw_response = analyze_text_for_misinformation(text)
        result = parse_gemini_response(raw_response)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'isTrue': False,
            'confidence': 0,
            'explanation': f'An error occurred while analyzing the text: {str(e)}',
            'sources': []
        }), 500

@app.route('/check-image', methods=['POST'])
def check_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Open and process the image
        try:
            image = Image.open(file.stream)
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
        except Exception as e:
            return jsonify({'error': f'Invalid image format: {str(e)}'}), 400
        
        # Analyze the image
        raw_response = analyze_image_for_misinformation(image)
        result = parse_gemini_response(raw_response)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'isTrue': False,
            'confidence': 0,
            'explanation': f'An error occurred while analyzing the image: {str(e)}',
            'sources': []
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'TruthLens API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)