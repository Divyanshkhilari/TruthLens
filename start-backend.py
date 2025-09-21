#!/usr/bin/env python3
"""
TruthLens Backend Startup Script
Starts the Flask API server for the fact-checking application.
"""

import os
import sys
import subprocess

def check_requirements():
    """Check if required packages are installed."""
    try:
        import flask
        import flask_cors
        import google.generativeai
        from PIL import Image
        import requests
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please run: pip install -r backend/requirements.txt")
        return False

def check_api_key():
    """Check if Google AI API key is configured."""
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        print("❌ GOOGLE_API_KEY environment variable not set")
        print("Please set your Google AI API key:")
        print("  export GOOGLE_API_KEY='your-api-key-here'")
        print("  or on Windows: set GOOGLE_API_KEY=your-api-key-here")
        return False
    print("✅ Google AI API key is configured")
    return True

def main():
    print("🚀 Starting TruthLens Backend Server...")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check API key
    if not check_api_key():
        sys.exit(1)
    
    print("✅ All checks passed!")
    print("🌐 Starting Flask server on http://localhost:8000")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask app
    try:
        os.chdir('backend')
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()