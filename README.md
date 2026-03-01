# 💰 ExpenseTracker

A comprehensive full-stack expense tracking application built with React and Node.js that helps users manage their finances, track transactions, and visualize spending patterns with modern UI/UX.

![ExpenseTracker Banner](https://img.shields.io/badge/ExpenseTracker-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#️-environment-setup)
- [Database Schema](#-database-schema)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** - Secure login/logout with JSON Web Tokens
- **Social Authentication** - Firebase integration for Google/Facebook login
- **Password Encryption** - Bcrypt hashing for secure password storage
- **Protected Routes** - Middleware-based route protection

### 💳 Account Management
- **Multi-Account Support** - Bank accounts, cash, credit cards, savings
- **Real-time Balance** - Dynamic balance calculations
- **Account Categories** - Organized account types with visual indicators
- **CRUD Operations** - Full create, read, update, delete functionality

### 📊 Transaction Tracking
- **Income & Expense** - Complete transaction categorization
- **Date Filtering** - Advanced date range filtering capabilities
- **Transaction Categories** - Customizable expense and income categories
- **Bulk Operations** - Multiple transaction management
- **Search & Filter** - Advanced search with multiple criteria

### 📈 Data Visualization
- **Interactive Charts** - Using Recharts for beautiful visualizations
- **Pie Charts** - Category-wise expense breakdown
- **Line Charts** - Spending trends over time
- **Bar Charts** - Monthly/yearly financial summaries
- **Dashboard Analytics** - Comprehensive financial overview

### 🔄 Data Management
- **Excel Export** - Export transactions to Excel files
- **Data Validation** - Form validation with Zod schemas
- **Real-time Updates** - Live data synchronization
- **Responsive Design** - Mobile-first design approach

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.2.0 |
| **Vite** | Build Tool | 6.3.5 |
| **Tailwind CSS** | Styling | 3.4.3 |
| **Zustand** | State Management | 4.5.2 |
| **React Router** | Navigation | 6.23.1 |
| **React Hook Form** | Form Management | 7.51.4 |
| **Recharts** | Data Visualization | 2.12.7 |
| **Firebase** | Authentication | 10.14.1 |
| **Axios** | HTTP Client | 1.6.8 |
| **Sonner** | Notifications | 1.4.41 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 16+ |
| **Express.js** | Web Framework | 5.1.0 |
| **PostgreSQL** | Database | 8.15.6 |
| **JWT** | Authentication | 9.0.2 |
| **Bcrypt** | Password Hashing | 5.1.1 |
| **CORS** | Cross-Origin Requests | 2.8.5 |
| **Dotenv** | Environment Variables | 16.5.0 |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Likhi2005/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Environment Setup

### Backend Environment Variables

Create `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
PG_USER=your_postgres_username
PG_HOST=localhost
PG_DB=expense_tracker
PG_PASSWORD=your_postgres_password
PG_PORT=5432

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Optional: Database URI (alternative to individual PG_ variables)
# DATABASE_URI=postgresql://username:password@localhost:5432/expense_tracker
```

### Frontend Environment Variables

Create `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api-v1

# Firebase Configuration (for social authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎯 Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Application runs on http://localhost:5173
   ```

3. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **API Documentation**: http://localhost:5000/api-docs (if implemented)

### Production Mode

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Production Server**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api-v1/auth/register` - User registration
- `POST /api-v1/auth/login` - User login
- `POST /api-v1/auth/logout` - User logout

### Account Management
- `GET /api-v1/accounts` - Get user accounts
- `POST /api-v1/accounts` - Create new account
- `PUT /api-v1/accounts/:id` - Update account
- `DELETE /api-v1/accounts/:id` - Delete account

### Transaction Management
- `GET /api-v1/transactions` - Get transactions with filters
- `POST /api-v1/transactions` - Create new transaction
- `PUT /api-v1/transactions/:id` - Update transaction
- `DELETE /api-v1/transactions/:id` - Delete transaction

### User Profile
- `GET /api-v1/users/profile` - Get user profile
- `PUT /api-v1/users/profile` - Update user profile

## 📁 Project Structure

```
ExpenseTracker/
├── backend/                 # Node.js Express API
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── accountControllers.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── libs/               # Utilities and configurations
│   │   ├── database.js     # PostgreSQL connection
│   │   └── index.js
│   ├── middleware/         # Custom middleware
│   │   └── authMiddleware.js
│   ├── routes/             # API route definitions
│   │   ├── authRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── index.js            # Main server file
│   └── package.json
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Basic UI components
│   │   │   └── wrappers/   # Layout components
│   │   ├── libs/           # Utilities and API calls
│   │   ├── pages/          # Page components
│   │   │   └── auth/       # Authentication pages
│   │   ├── store/          # Zustand state management
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static public assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🎯 Usage Guide

### 1. User Registration/Login
- Create a new account or sign in with existing credentials
- Option for social authentication via Firebase

### 2. Account Setup
- Add your financial accounts (bank, cash, credit cards)
- Set initial balances for each account
- Categorize accounts by type

### 3. Transaction Management
- Record income and expense transactions
- Categorize transactions for better tracking
- Add descriptions and transaction dates

### 4. Data Analysis
- View interactive charts and graphs
- Filter data by date ranges
- Export transaction data to Excel
- Monitor spending patterns and trends

### 5. Settings & Profile
- Update personal information
- Change password
- Manage account preferences

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Backend Deployment (Heroku/Railway)

1. **Prepare for deployment**
   ```bash
   # Add start script in package.json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   }
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create your-expense-tracker-api
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

### Environment Variables for Production
- Set all required environment variables in your deployment platform
- Use production database credentials
- Set `NODE_ENV=production`
- Configure CORS for production domain

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/Likhi2005/ExpenseTracker.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open Pull Request**

### Development Guidelines
- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Likhi2005**
- GitHub: [@Likhi2005](https://github.com/Likhi2005)
- Repository: [ExpenseTracker](https://github.com/Likhi2005/ExpenseTracker)

## 🆘 Support

If you encounter any problems or have questions:

1. **Check Issues**: Browse existing [GitHub Issues](https://github.com/Likhi2005/ExpenseTracker/issues)
2. **Create New Issue**: Report bugs or request features
3. **Documentation**: Refer to this README for setup instructions
4. **Contact**: Reach out via GitHub

## Acknowledgments
- Inspired by modern financial management applications
- Built with love using open-source technologies
- Special thanks to the React and Node.js communities

---

⭐ **Star this repository** if you found it helpful!

🐛 **Found a bug?** [Report it here](https://github.com/Likhi2005/ExpenseTracker/issues)

💡 **Have a feature idea?** [Suggest it here](https://github.com/Likhi2005/ExpenseTracker/issues)