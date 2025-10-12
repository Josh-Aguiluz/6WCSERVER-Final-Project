# HAU Eco-Quest

A comprehensive environmental sustainability platform for Holy Angel University.

## Team Members
- Aguiluz, Josh Andrei D.
- Camus, Mark Dave
- Tienzo, Krisean
- Velasquez, Ainshley
- Yamaguchi, Mikaella

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 6WCSERVER-Final-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # At minimum, add:
   MONGODB_URI=mongodb://localhost:27017/hauEcoQuestDB
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

### Demo Mode

The application can run in **demo mode** when MongoDB is not available:
- ✅ UI displays with sample data
- ✅ Navigation works
- ❌ No data persistence
- ❌ No user authentication

## Security

⚠️ **IMPORTANT**: Never expose environment variables publicly!

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

## Features

- 🌱 **Eco-Quests**: Environmental challenges and activities
- 🏆 **Badge System**: Achievement tracking and rewards
- 👥 **Community**: Social features and leaderboards
- 📱 **Responsive Design**: Works on all devices
- 🔐 **Secure Authentication**: JWT-based user management

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Security**: CORS, Security Headers

## API Documentation

The API runs on `http://localhost:5000/api`

### Key Endpoints:
- `POST /api/auth/login` - User login
- `GET /api/quests` - Get all quests
- `POST /api/quests/:id/submit` - Submit quest completion
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/posts` - Get community posts

## Development

### Project Structure
```
├── client/          # React frontend
├── routes/          # API routes
├── models/          # MongoDB models
├── middleware/      # Express middleware
├── config/          # Configuration files
└── server.js        # Main server file
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run client` - Start frontend only
- `npm run server` - Start backend only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes at Holy Angel University.

