#!/usr/bin/env python3
"""
Production server startup script for TruthLens API
Uses Gunicorn for production-ready WSGI server
"""

import os
import sys
import subprocess

def check_requirements():
    """Check if required packages are installed."""
    try:
        import flask
        import flask_cors
        import flask_limiter
        import google.generativeai
        from PIL import Image
        import requests
        import bleach
        import gunicorn
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
    print("🚀 Starting TruthLens Production Server...")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check API key
    if not check_api_key():
        sys.exit(1)
    
    # Set production environment
    os.environ['FLASK_ENV'] = 'production'
    
    print("✅ All checks passed!")
    print("🌐 Starting Gunicorn server on http://localhost:8001")
    print("📊 Workers: 2, Timeout: 30s")
    print("🔒 Security features enabled")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start Gunicorn
    try:
        cmd = [
            'gunicorn',
            '--config', 'gunicorn.conf.py',
            'app:app'
        ]
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ Gunicorn not found. Installing...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'gunicorn'], check=True)
        print("✅ Gunicorn installed. Restarting...")
        subprocess.run(cmd, check=True)

if __name__ == '__main__':
    main()