# Deploy StudyHinter Backend to Railway

## Quick Deploy

### Option 1: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. Go to [Railway Dashboard](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the Python app and configure it
6. Add environment variables in the Railway dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `UNSPLASH_ACCESS_KEY`: Your Unsplash API key
   - `CORS_ORIGINS`: Your frontend URL (or `*` for development)
   - `DEBUG`: False

### Option 2: Deploy with Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project (run from backend directory)
cd app2-StudyHinter/backend
railway init

# Add environment variables
railway variables set GEMINI_API_KEY=your_api_key_here
railway variables set UNSPLASH_ACCESS_KEY=your_unsplash_key_here
railway variables set CORS_ORIGINS=*
railway variables set DEBUG=False

# Deploy
railway up
```

## Environment Variables

Required:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `UNSPLASH_ACCESS_KEY`: Get from [Unsplash Developers](https://unsplash.com/developers)

Optional:
- `API_HOST`: 0.0.0.0 (default)
- `PORT`: Automatically set by Railway
- `CORS_ORIGINS`: Your frontend URL (or `*` for all origins)
- `DEBUG`: False (production)

## Configuration

Railway automatically detects:
- Python runtime from `requirements.txt`
- Start command from `Procfile` or `railway.toml`
- Port from `$PORT` environment variable

The `railway.toml` file provides explicit configuration for:
- Build process (Nixpacks)
- Start command
- Health check endpoint
- Restart policy

## Post-Deployment

1. Railway will provide a URL like: `https://studyhinter-backend-production.up.railway.app`
2. Test the health endpoint: `https://your-app.up.railway.app/`
3. Update your frontend's API URL to point to this backend
4. Update `CORS_ORIGINS` with your frontend URL

## Custom Domain (Optional)

1. Go to your service settings in Railway
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Notes

- Railway's free tier includes $5 credit per month
- No cold starts - services stay warm
- Automatic HTTPS
- Built-in monitoring and logs
- Supports environment-specific variables
- Easy rollbacks from the dashboard

## Advantages over Render

- No cold starts on free tier
- Faster deployments
- Better developer experience
- More generous free tier
- Built-in metrics and monitoring
