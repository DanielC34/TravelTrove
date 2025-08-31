# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travel-trove

# JWT Configuration (CRITICAL - Must be at least 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Client Configuration
CLIENT_URL=http://localhost:3000

# Security Configuration
CORS_ORIGIN=http://localhost:3000

# Logging Configuration
LOG_LEVEL=info
```

## Security Requirements

### JWT_SECRET
- **Minimum length**: 32 characters
- **Recommended**: 64+ characters
- **Format**: Random string with mixed case, numbers, and special characters
- **Example**: `JWT_SECRET=MySuperSecureJWTSecretKey2024!@#$%^&*()_+`

### Generating a Secure JWT Secret

#### Option 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Option 2: Using OpenSSL
```bash
openssl rand -hex 64
```

#### Option 3: Online Generator
Use a secure random string generator (not recommended for production)

## Validation

The server will validate your environment variables on startup:

1. **Required variables**: Must be present
2. **JWT_SECRET strength**: Must be at least 32 characters
3. **MongoDB connection**: Will attempt to connect and report status

## Error Messages

If you see these errors, fix the corresponding environment variable:

- `❌ CRITICAL: JWT_SECRET is not properly configured!`
  - Set a strong JWT_SECRET in your .env file

- `❌ CRITICAL: JWT_SECRET is too weak!`
  - Make your JWT_SECRET at least 32 characters long

- `❌ CRITICAL: Missing required environment variables:`
  - Add the missing variables to your .env file

## Production Considerations

For production deployment:

1. **Use environment-specific .env files**:
   - `.env.development`
   - `.env.production`
   - `.env.test`

2. **Secure JWT_SECRET**:
   - Use a cryptographically secure random generator
   - Store in environment variables, not in code
   - Rotate regularly

3. **Database Security**:
   - Use MongoDB Atlas or secure MongoDB instance
   - Enable authentication
   - Use SSL/TLS connections

4. **CORS Configuration**:
   - Set specific origins, not wildcards
   - Use HTTPS in production

5. **Rate Limiting**:
   - Adjust rate limits based on your needs
   - Monitor for abuse

## Testing Your Setup

1. Start the server: `npm run dev`
2. Check health endpoint: `http://localhost:3001/health`
3. Test authentication: `http://localhost:3001/api/auth/register`

## Troubleshooting

### Common Issues

1. **"JWT_SECRET is not configured"**
   - Check your .env file exists in the server directory
   - Verify JWT_SECRET is set and not empty

2. **"MongoDB connection error"**
   - Ensure MongoDB is running
   - Check MONGODB_URI format
   - Verify network connectivity

3. **"CORS error"**
   - Check CLIENT_URL matches your frontend URL
   - Verify CORS_ORIGIN setting

### Debug Mode

Set `NODE_ENV=development` to enable:
- Request logging
- Detailed error messages
- User info in response headers
