from flask import Flask, request, jsonify
from flask_cors import CORS
from project_1 import analyze_text_for_misinformation, analyze_image_for_misinformation
import json
import re
import os
from werkzeug.utils import secure_filename
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import bleach

app = Flask(__name__)

# Security Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')

# CORS Configuration - More permissive for development
if os.getenv('FLASK_ENV') == 'development':
    CORS(app, origins="*")  # Allow all origins in development
else:
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
    CORS(app, origins=allowed_origins)

# Rate Limiting
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["100 per hour", "20 per minute"]
)

# Allowed file extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def sanitize_text(text):
    """Sanitize input text to prevent XSS and other attacks"""
    if not text:
        return ""
    # Remove HTML tags and limit length
    cleaned = bleach.clean(text, tags=[], strip=True)
    return cleaned[:2000]  # Limit to 2000 characters

def parse_analysis_to_json(analysis_text):
    """Convert the analysis text to the expected JSON format for the frontend."""
    try:
        analysis_lower = analysis_text.lower()
        
        # Try to extract percentages from the first line (new format)
        percentage_match = re.search(r'(\d+)%\s+likely\s+to\s+be\s+(accurate|genuine).*?(\d+)%\s+likely.*?(misinformation|manipulated).*?(\d+)%\s+likely.*?(misleading)', analysis_lower)
        
        if percentage_match:
            genuine_pct = int(percentage_match.group(1))
            false_pct = int(percentage_match.group(3))
            misleading_pct = int(percentage_match.group(5))
            
            # Use the genuine percentage as confidence, determine truthfulness
            if genuine_pct >= 60:
                is_true = True
                confidence = min(95, genuine_pct + 10)  # Add some confidence boost
            elif false_pct >= 50:
                is_true = False
                confidence = min(95, false_pct + 15)  # Higher confidence for clear falsehoods
            else:
                is_true = False  # Lean towards caution when uncertain
                confidence = max(30, 100 - misleading_pct - false_pct)
        else:
            # Fallback to keyword analysis if percentage extraction fails
            strong_negative = [
                'fake', 'false', 'misleading', 'scam', 'manipulated', 'fabricated', 
                'hoax', 'conspiracy', 'debunked', 'untrue', 'deceptive', 'fraudulent',
                'suspicious', 'red flags', 'warning signs', 'concerning', 'doubt',
                'misinformation', 'disinformation', 'propaganda'
            ]
            
            positive_indicators = [
                'credible', 'accurate', 'verified', 'legitimate', 'authentic', 
                'reliable', 'factual', 'genuine', 'trustworthy', 'evidence-based',
                'well-sourced', 'documented', 'confirmed', 'looks real', 'appears genuine',
                'likely genuine', 'probably accurate'
            ]
            
            # Count indicators with more nuanced scoring
            strong_neg_count = sum(1 for indicator in strong_negative if indicator in analysis_lower)
            positive_count = sum(1 for indicator in positive_indicators if indicator in analysis_lower)
            
            # More dynamic confidence calculation
            if strong_neg_count >= 3:
                is_true = False
                confidence = min(95, 75 + (strong_neg_count * 5))
            elif positive_count >= 2 and strong_neg_count == 0:
                is_true = True
                confidence = min(90, 70 + (positive_count * 6))
            elif strong_neg_count > positive_count:
                is_true = False
                confidence = min(85, 60 + (strong_neg_count * 8))
            elif positive_count > strong_neg_count:
                is_true = True
                confidence = min(80, 55 + (positive_count * 7))
            else:
                is_true = False  # Default to caution
                confidence = 45 + (len(analysis_text) // 100)  # Vary based on analysis length
        
        # Generate sources based on content
        sources = []
        if any(word in analysis_lower for word in ['verify', 'check', 'source', 'research', 'fact-check']):
            sources = [
                {
                    "title": "Snopes Fact-Checking",
                    "url": "https://www.snopes.com",
                    "domain": "snopes.com"
                },
                {
                    "title": "FactCheck.org",
                    "url": "https://www.factcheck.org",
                    "domain": "factcheck.org"
                }
            ]
            
        if 'reverse image search' in analysis_lower or 'image' in analysis_lower:
            sources.append({
                "title": "Google Reverse Image Search",
                "url": "https://images.google.com",
                "domain": "images.google.com"
            })
        
        return {
            "isTrue": is_true,
            "confidence": confidence,
            "explanation": analysis_text,
            "sources": sources
        }
        
    except Exception as e:
        return {
            "isTrue": False,
            "confidence": 50,
            "explanation": f"Analysis completed: {analysis_text}",
            "sources": []
        }

@app.route('/check-text', methods=['POST'])
@limiter.limit("10 per minute")
def check_text():
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
            
        text = data.get('text')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Sanitize and validate input
        text = sanitize_text(text)
        if len(text) < 10:
            return jsonify({'error': 'Text too short (minimum 10 characters)'}), 400
        
        app.logger.info(f"Analyzing text: {text[:50]}...")
        
        # Get analysis from your friend's function
        analysis = analyze_text_for_misinformation(text)
        
        # Convert to expected JSON format
        result = parse_analysis_to_json(analysis)
        
        return jsonify(result)
        
    except Exception as e:
        app.logger.error(f"Error in check_text: {str(e)}")
        return jsonify({
            'isTrue': False,
            'confidence': 0,
            'explanation': 'An error occurred while analyzing the text. Please try again.',
            'sources': []
        }), 500

@app.route('/check-image', methods=['POST'])
@limiter.limit("5 per minute")  # Lower limit for image processing
def check_image():
    try:
        # Validate file upload
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, GIF, and WebP are allowed.'}), 400
        
        # Secure filename
        filename = secure_filename(file.filename)
        
        # Save the uploaded image temporarily and analyze it directly
        from PIL import Image
        import google.generativeai as genai
        import textwrap
        
        try:
            # Open and validate the image
            image = Image.open(file.stream)
            
            # Security: Verify it's actually an image and not malicious file
            image.verify()
            file.stream.seek(0)  # Reset stream after verify
            image = Image.open(file.stream)
            
            # Convert to RGB and limit size for security
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Limit image size to prevent memory exhaustion
            max_size = (2048, 2048)
            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Use Gemini to analyze the image directly
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = textwrap.dedent("""
            You are TruthLens, an AI that analyzes images for authenticity. Provide a detailed analysis using this EXACT format:

            This image is **X% likely to be genuine**, **Y% likely to be manipulated**, and **Z% likely to be used in a misleading context**.

            1. **Fake Image**: Assess the probability of this image being AI-generated or completely fabricated. Explain your reasoning.

            2. **Credibility Assessment**: Provide an overall assessment of the image's authenticity and reliability.

            3. **Identified Issues**: List specific visual problems you noticed:
               - Image quality issues (pixelation, blurriness, compression artifacts)
               - Lighting inconsistencies or shadows that don't match
               - Unnatural transitions between elements
               - Text or graphic overlays that seem suspicious

            4. **Contextual Analysis**: Analyze what the image shows and potential context issues:
               - What scenes or elements are depicted
               - How they might be connected or disconnected
               - Potential for misleading presentation
               - Any watermarks, stamps, or identifying marks

            5. **Verification Steps**: Provide specific actionable steps:
               - Reverse image search recommendations
               - Source verification methods
               - Cross-referencing suggestions
               - Technical analysis recommendations

            Make sure the percentages in the first line add up to 100%. Use **bold text** for emphasis.
            """)
            
            response = model.generate_content([prompt, image])
            analysis = response.text
            
        except Exception as e:
            app.logger.error(f"Error analyzing image: {str(e)}")
            analysis = "Unable to analyze the image. Please ensure it's a valid image file."
        
        # Convert to expected JSON format
        result = parse_analysis_to_json(analysis)
        
        return jsonify(result)
        
    except Exception as e:
        app.logger.error(f"Error in check_image: {str(e)}")
        return jsonify({
            'isTrue': False,
            'confidence': 0,
            'explanation': 'An error occurred while analyzing the image. Please try again.',
            'sources': []
        }), 500

@app.route('/analyze-text', methods=['POST'])
def analyze_text():
    """Legacy endpoint for compatibility"""
    data = request.json
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    analysis = analyze_text_for_misinformation(text)
    return jsonify({'analysis': analysis})

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    """Legacy endpoint for compatibility"""
    data = request.json
    image_url = data.get('image_url')
    
    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400
    
    analysis = analyze_image_for_misinformation(image_url)
    return jsonify({'analysis': analysis})

@app.route('/health', methods=['GET'])
@limiter.limit("30 per minute")
def health_check():
    return jsonify({'status': 'healthy', 'message': 'TruthLens API is running'})

@app.route('/test-gemini', methods=['GET'])
@limiter.limit("5 per minute")
def test_gemini():
    """Test endpoint to verify Gemini API is working - Remove in production"""
    try:
        import google.generativeai as genai
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Say 'Hello from Gemini!' if you can read this.")
        return jsonify({
            'status': 'success',
            'message': 'Gemini API is working',
            'response': response.text
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Gemini API error: {str(e)}'
        }), 500

# Error handlers
@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error. Please try again later.'}), 500

if __name__ == '__main__':
    # Security: Disable debug mode in production
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    port = int(os.getenv('PORT', 8001))
    host = '0.0.0.0' if debug_mode else '127.0.0.1'
    app.run(debug=debug_mode, host=host, port=port)