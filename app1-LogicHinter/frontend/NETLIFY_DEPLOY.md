# Deploy LogicHinter Frontend to Netlify

## Quick Deploy

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to your GitHub repository
5. Netlify will auto-detect the `netlify.toml` configuration

## Manual Configuration (if needed)

If auto-detection doesn't work, configure manually:

- **Base directory**: `app1-LogicHinter/frontend`
- **Build command**: `npm run build`
- **Publish directory**: `app1-LogicHinter/frontend/dist`

## Environment Variables

Add in Netlify dashboard under **Site settings** → **Environment variables**:

- **Key**: `VITE_API_BASE`
- **Value**: Your Render backend URL (e.g., `https://logichinter-backend.onrender.com`)

## Post-Deployment

1. Get your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Update your backend's `CORS_ORIGINS` environment variable in Render to include this URL
3. Test the connection between frontend and backend

## Important Notes

- The `.env.production` file is a template - actual values are set in Netlify dashboard
- Don't commit real API URLs to `.env.production` if they contain secrets
- Netlify automatically rebuilds on git push to your main branch
