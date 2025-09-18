# Full-Stack Practical Coding Challenges (Interview Edition)

A comprehensive full-stack application implementing three challenging features: high-performance data processing, tree hierarchy rendering, and real-time dashboard.

## 🏗️ Architecture

This is a mono-repo containing:
- **Backend**: Node.js/Express API with WebSocket support
- **Frontend**: React/TypeScript SPA with Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Seed the database with sample data
npm run seed

# Start development servers
npm run dev
```

### Environment Setup

Create the following environment files:

**Backend (.env):**
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### Available Scripts

#### Root Level
- `npm run dev` - Start both backend and frontend in development mode
- `npm run build` - Build both applications for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run seed` - Seed database with sample data

#### Backend (Port 3001)
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests
- `npm run seed` - Seed database

#### Frontend (Port 3000)
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests

## 📋 Challenges Implemented

### Challenge 1: Data Processing & Rendering
- **Backend**: High-performance API with server-side pagination, sorting, and filtering
- **Frontend**: Virtualized data table with 50,000+ records
- **Features**: Real-time search, aggregate calculations, performance optimization

### Challenge 2: Tree & Hierarchy Rendering
- **Backend**: Tree structure API with lazy loading
- **Frontend**: Interactive org chart with search and auto-expansion
- **Features**: Lazy loading, search highlighting, keyboard navigation

### Challenge 3: Real-time Dashboard
- **Backend**: WebSocket server for live data streaming
- **Frontend**: Real-time dashboard with charts and live updates
- **Features**: WebSocket connection, data visualization, performance optimization

## 🔧 API Documentation

### Challenge 1: Data Processing
- `POST /dev/seed?users=50000&orders=500000&products=10000` - Seed database
- `GET /api/users` - Get paginated users with orders
- `GET /api/users/:id/orders` - Get user orders

### Challenge 2: Tree Hierarchy
- `POST /dev/seed?breadth=20&depth=10` - Generate tree structure
- `GET /api/nodes/root` - Get root nodes
- `GET /api/nodes/:id/children` - Get node children
- `GET /api/search?q=...&limit=100` - Search nodes

### Challenge 3: Real-time Dashboard
- `GET /api/quotes/snapshot?symbols=AAPL,MSFT,GOOG` - Get current quotes
- `WS /ws/quotes` - WebSocket for live quotes

## 🧪 Testing

### Local Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:backend
npm run test:frontend

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format

# Run full CI pipeline locally
npm run ci
```

### GitHub Actions Testing
โปรเจคนี้มีการทดสอบอัตโนมัติผ่าน GitHub Actions:

- **การทดสอบ**: รันทุกครั้งที่ push หรือ pull request
- **Backend Tests**: ทดสอบ Node.js backend ด้วย Jest
- **Frontend Tests**: ทดสอบ React frontend ด้วย Vitest
- **Code Quality**: ตรวจสอบ ESLint, Prettier, และ TypeScript

#### ไฟล์ Workflow:
- `.github/workflows/test.yml` - การทดสอบหลัก
- `.github/workflows/code-quality.yml` - ตรวจสอบคุณภาพโค้ด

#### ดูผลการทดสอบ:
1. ไปที่แท็บ "Actions" ใน GitHub repository
2. คลิกที่ workflow run เพื่อดูผลลัพธ์
3. ตรวจสอบสถานะการทดสอบในแต่ละขั้นตอน

## 🚀 Production Deployment

```bash
# Build for production
npm run build

# The built files will be in:
# - backend/dist/ (compiled JavaScript)
# - frontend/dist/ (static assets)
```

## 📁 Project Structure

```
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utilities
│   ├── tests/              # Backend tests
│   └── package.json
├── frontend/               # React/TypeScript SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   ├── tests/              # Frontend tests
│   └── package.json
├── .github/workflows/      # GitHub Actions workflows
└── README.md
```

## 🔒 Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

## 📊 Performance Targets

- **Challenge 1**: First page load < 500ms, pagination < 300ms
- **Challenge 2**: Child fetch < 300ms, smooth navigation with 10k nodes
- **Challenge 3**: 20 symbols at 20 updates/sec with stable UI

## 🏆 Evaluation Criteria

- ✅ Correctness & Tests (25 points)
- ✅ Performance & Efficiency (25 points)
- ✅ Code Quality & Structure (20 points)
- ✅ UX & Accessibility (10 points)
- ✅ Security & Robustness (10 points)
- ✅ Documentation & Dev Experience (10 points)

## 🎯 Bonus Features

- Virtual scrolling for large datasets
- WebSocket reconnection with exponential backoff
- Comprehensive test coverage
- Docker support
- OpenAPI documentation
