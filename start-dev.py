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
    os.environ['GOOGLE_API_KEY'] = 'AIzaSyAwjjxvTlkPT2tvJ3ZQoQHjbrSULjL0swk'
    
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