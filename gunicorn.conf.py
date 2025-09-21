"""
Gunicorn configuration for production deployment
"""
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '8001')}"
backlog = 2048

# Worker processes
workers = 2
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "truthlens-api"

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# SSL (uncomment for HTTPS)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"