#!/usr/bin/env python3
"""
Development server startup script for TruthLens API
"""

import os
import sys

def main():
    print("🚀 Starting TruthLens Development Server...")
    print("=" * 50)
    
    # Set development environment
    os.environ['FLASK_ENV'] = 'development'
    
    # Check if API key is already set
    if not os.getenv('GOOGLE_API_KEY'):
        print("❌ GOOGLE_API_KEY not found!")
        print("Please set your Google AI API key:")
        print("  export GOOGLE_API_KEY='your-api-key-here'")
        print("  or on Windows: set GOOGLE_API_KEY=your-api-key-here")
        sys.exit(1)
    
    print("✅ Development mode enabled")
    print("🌐 Server will start on http://localhost:8001")
    print("🔧 Debug mode: ON")
    print("⚠️  This is for development only!")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Import and run the app
    from app import app
    app.run(debug=True, host='0.0.0.0', port=8001)

if __name__ == '__main__':
    main()