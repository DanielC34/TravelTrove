# OAuth Testing Guide

## Quick Start

1. **Start both servers:**
   - Double-click `start-dev.bat` (Windows)
   - Or run `./start-dev.ps1` in PowerShell
   - Or manually start each server:
     ```bash
     # Terminal 1 - Backend
     cd server
     npm run dev
     
     # Terminal 2 - Frontend  
     cd client
     npm run dev
     ```

2. **Test OAuth Flow:**
   - Open http://localhost:5173
   - Click "Login" or "Register"
   - Click the "Google" button
   - Complete Google OAuth flow
   - You should be redirected back and logged in

## OAuth Flow Details

1. **Frontend** → Click Google button → Redirects to `http://localhost:3001/api/auth/google`
2. **Backend** → Passport.js handles Google OAuth → Redirects to Google
3. **Google** → User authenticates → Redirects to `http://localhost:3001/api/auth/google/callback`
4. **Backend** → Creates/finds user → Generates JWT → Redirects to `http://localhost:5173/auth/callback?token=...&user=...`
5. **Frontend** → AuthCallback component → Stores token → Redirects to `/explore`

## Troubleshooting

- **"OAuth failed"**: Check Google Cloud Console authorized origins
- **CORS errors**: Verify CLIENT_URL in .env matches frontend URL
- **Token issues**: Check JWT_SECRET in .env
- **Database errors**: Verify MongoDB connection

## Required Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3001`
6. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback`