# Security Guide for HAU Eco-Quest

## Environment Variables Security

### ⚠️ CRITICAL: Never expose sensitive environment variables publicly!

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hauEcoQuestDB

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Security Best Practices

1. **Never commit `.env` files to version control**
   - The `.env` file is already in `.gitignore`
   - Use `.env.example` for reference

2. **Generate strong secrets**
   ```bash
   # Generate a strong JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Use environment-specific configurations**
   - Development: `NODE_ENV=development`
   - Production: `NODE_ENV=production`

4. **Secure MongoDB connection**
   - Use connection strings with authentication
   - Enable SSL/TLS in production
   - Use IP whitelisting

## Demo Mode

The application can run in demo mode when:
- MongoDB connection is unavailable
- Environment variables are missing
- Database connection fails

### Demo Mode Features:
- ✅ Static content displays
- ✅ Basic navigation works
- ✅ UI components render
- ❌ User authentication disabled
- ❌ Data persistence disabled
- ❌ Real-time features disabled

## Deployment Security

### For Production:

1. **Use environment variables in deployment**
   ```bash
   # Heroku example
   heroku config:set MONGODB_URI=your-production-mongodb-uri
   heroku config:set JWT_SECRET=your-production-jwt-secret
   ```

2. **Enable HTTPS**
   ```javascript
   // Force HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

3. **Set secure CORS origins**
   ```javascript
   // Update allowedOrigins in config/security.js
   allowedOrigins: [
     'https://yourdomain.com',
     'https://www.yourdomain.com'
   ]
   ```

## Security Headers

The application includes these security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Monitoring

### Check database connection:
```javascript
const { isDatabaseAvailable } = require('./db');
console.log('Database available:', isDatabaseAvailable());
```

### Validate environment:
```javascript
const { validateEnvironment } = require('./config/security');
const { warnings, errors } = validateEnvironment();
console.log('Warnings:', warnings);
console.log('Errors:', errors);
```

## Troubleshooting

### Common Issues:

1. **"Database temporarily unavailable"**
   - Check MongoDB connection
   - Verify MONGODB_URI is correct
   - Check network connectivity

2. **"JWT_SECRET is required"**
   - Add JWT_SECRET to .env file
   - Restart the server

3. **CORS errors**
   - Update allowedOrigins in config/security.js
   - Check frontend URL matches allowed origins

## Support

For security issues or questions, please contact the development team.
