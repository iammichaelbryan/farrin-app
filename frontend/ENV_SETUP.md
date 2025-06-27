# Environment Setup for Frontend

## API Keys Configuration

### Travel Buddy API (RapidAPI)

1. **Get your API key**:
   - Go to [RapidAPI](https://rapidapi.com/)
   - Sign up/Login
   - Subscribe to the **Visa Requirements API** by Travel Buddy
   - Copy your API key from the dashboard

2. **Add to environment file**:
   - Open `/frontend/.env.local`
   - Replace `YOUR_RAPIDAPI_KEY_HERE` with your actual API key

### Example .env.local file:

```env
# RapidAPI Key for Travel Buddy Visa Requirements
VITE_RAPIDAPI_KEY=abc123def456ghi789jkl012mno345pqr678stu901

# Other optional environment variables
VITE_API_BASE_URL=http://localhost:8081
VITE_DEBUG_MODE=true
```

### Restart Development Server

After adding your API key, restart the frontend:

```bash
cd frontend
npm run dev
```

## Security Notes

- ✅ `.env.local` is already added to `.gitignore`
- ✅ Never commit API keys to the repository
- ✅ Use different keys for development/staging/production

## Testing the API

Once configured, the Solo trip Travel Requirements in Step 3 will use real visa data from Travel Buddy API.