# On-Demand Service Application|*Supervised by Sir Ameer Hamza*|Developed by Khalid Mehmood|

A full-stack on-demand service platform (similar to Urban Company) where customers book services, providers accept and complete jobs, and admins manage the platform.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile App | React Native (Expo), TypeScript, React Query |
| Admin Panel | Next.js 16, TypeScript, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript, Sequelize ORM |
| Database | MySQL |

## Project Structure

```
on-demand-service-app/
├── backend/          # REST API (Express + Sequelize)
├── admin-panel/      # Next.js admin dashboard
├── mobile/           # React Native customer & provider app
└── README.md
```

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm

## Quick Start

### 1. Database

Create MySQL database and configure credentials in `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=ondemand_services
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### 2. Backend

```bash
cd backend
npm install
npm run seed      # Seed admin, sample users, services, categories
npm run dev       # http://localhost:5000
```

API base URL: **http://localhost:5000/api**

API documentation: [backend/README.md](backend/README.md)

### 3. Admin Panel

```bash
cd admin-panel
npm install
```

Create `admin-panel/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev       # http://localhost:3000
```

### 4. Mobile App

```bash
cd mobile
npm install
npm start         # Expo dev server
```

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go on physical device

API auto-detects:
- Android emulator → `http://10.0.2.2:5000/api`
- iOS simulator / web → `http://localhost:5000/api`

## URLs

| App | URL |
|-----|-----|
| Backend API | http://localhost:5000/api |
| Admin Panel | http://localhost:3000 |
| Admin Login | http://localhost:3000/login |
| Mobile (Expo) | exp://localhost:8081 |

## Sample Credentials

Run `npm run seed` in the backend folder first.

| Role | Email | Password | App |
|------|-------|----------|-----|
| Admin | admin@example.com | admin123 | Admin Panel |
| Customer | customer@example.com | customer123 | Mobile App |
| Provider | provider@example.com | provider123 | Mobile App |

## Core Requirements (Fulfilled)

### Mobile — Customer
| Requirement | Status |
|-------------|--------|
| Sign up / Login | ✅ `LoginScreen`, `RegisterScreen` |
| Browse available services | ✅ `HomeScreen` |
| Book service with date & time | ✅ `ServiceDetailContent` |
| Booking history & status tracking | ✅ `BookingHistoryScreen`, `BookingCard` |
| Profile management | ✅ `ProfileScreen` (edit name, phone, logout) |
| Mock payment after service | ✅ Pay when status is `awaiting_payment` |

### Mobile — Provider
| Requirement | Status |
|-------------|--------|
| Accept / reject jobs | ✅ `ProviderJobsScreen` |
| Manage availability | ✅ `AvailabilityScreen` (add / delete slots) |
| Complete service | ✅ Provider marks job done → customer pays |

### Admin Panel
| Requirement | Status |
|-------------|--------|
| Admin login | ✅ `/login` |
| Manage users | ✅ List, create, edit, block, delete |
| Manage services & categories | ✅ CRUD + pricing |
| View & update booking status | ✅ List, detail, assign provider |
| Dashboard stats | ✅ Users, bookings, services counts |

## Booking Flow (Uber-style)

```
Customer books → Provider accepts → Provider starts → Provider completes service
→ Customer pays (mock) → Completed (visible in admin + provider app)
```

## Features

### Mobile App (Customer)
- Sign up / Login
- Browse available services
- Book a service with date, time, and notes
- Track booking status with progress indicator
- Pay with mock card when provider completes service
- View booking history and cancel pending bookings
- Edit profile (name, phone)

### Mobile App (Provider)
- Sign up as provider
- View pending job requests — accept or reject
- Manage assigned jobs (start → complete service)
- See payment status when customer pays
- Set weekly availability schedule

### Admin Panel
- Admin login with JWT auth
- Dashboard with user/booking/service stats
- Manage users (create, edit, block, delete)
- Manage service categories and services (including pricing)
- View bookings, update status, assign providers
- View payment details (read-only — payment happens in mobile app)

### Backend
- RESTful APIs with role-based access control
- JWT authentication
- Input validation and error handling
- MySQL with Sequelize ORM

## Database Schema

Full SQL schema: [backend/database/schema.sql](backend/database/schema.sql)

**Tables:** `users`, `service_categories`, `services`, `bookings`, `provider_availabilities`

## Production Build

```bash
# Backend
cd backend && npm run build && npm start

# Admin
cd admin-panel && npm run build && npm start
```

## License

MIT
