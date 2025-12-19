import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'secret-key-maxdienz'
    CORS_ORIGINS = [
        "https://ai-max-frontend.vercel.app",  # Domain frontend sau này
        "http://localhost:3000"  # Cho dev
    ]
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
