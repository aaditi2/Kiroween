# Deploy StudyHinter Backend to Render

## Quick Deploy

### Option 1: Blueprint (Recommended)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and configure everything
6. Add your environment variables in the Render dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `UNSPLASH_ACCESS_KEY`: Your Unsplash API key

### Option 2: Manual Web Service
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: studyhinter-backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
6. Add environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `UNSPLASH_ACCESS_KEY`: Your Unsplash API key
   - `CORS_ORIGINS`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)
   - `DEBUG`: False

## Environment Variables

Required:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `UNSPLASH_ACCESS_KEY`: Get from [Unsplash Developers](https://unsplash.com/developers)

Optional (auto-configured):
- `API_HOST`: 0.0.0.0 (default)
- `API_PORT`: Set by Render automatically
- `CORS_ORIGINS`: Update with your frontend URL
- `DEBUG`: False (production)

## Post-Deployment

1. Your backend will be available at: `https://studyhinter-backend.onrender.com`
2. Test the health endpoint: `https://studyhinter-backend.onrender.com/`
3. Update your frontend's API URL to point to this backend
4. Update `CORS_ORIGINS` in Render dashboard with your frontend URL

## Notes

- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Upgrade to paid plan for always-on service
- Logs are available in the Render dashboard
