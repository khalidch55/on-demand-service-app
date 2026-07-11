# Backend API Documentation

REST API for the On-Demand Service Application.

**Base URL:** `http://localhost:5000/api`

All responses follow this format:

```json
{ "success": true, "data": { ... } }
```

Errors:

```json
{ "success": false, "message": "Error description" }
```

## Authentication

JWT via `Authorization: Bearer <token>` header or `token` httpOnly cookie.

### POST `/auth/register`
Register a customer or provider.

```json
{ "name": "John", "email": "john@example.com", "password": "pass123", "phone": "1234567890", "role": "customer" }
```

### POST `/auth/login`
Login any user role.

### POST `/auth/logout`
Clear auth cookie.

### GET `/auth/me` — Auth required
Get current user profile.

### PUT `/auth/me` — Auth required
Update profile: `{ "name": "...", "phone": "..." }`

### POST `/admin/login`
Admin-only login (rejects non-admin users).

---

## Services

### GET `/services` — Auth required
List services. Query: `?activeOnly=true`

### GET `/services/:id` — Auth required

### GET `/services/categories` — Auth required

### POST `/services/categories` — Admin
### PUT `/services/categories/:id` — Admin
### DELETE `/services/categories/:id` — Admin

### POST `/services` — Admin
```json
{ "name": "Home Cleaning", "description": "...", "price": 120, "durationMinutes": 240, "categoryId": 1, "isActive": true }
```

### PUT `/services/:id` — Admin
### DELETE `/services/:id` — Admin

---

## Bookings

### POST `/bookings` — Customer
```json
{ "serviceId": 1, "dateTime": "2026-07-15T10:00:00.000Z", "notes": "Optional" }
```

### GET `/bookings/my` — Customer
Customer's booking history.

### GET `/bookings/provider` — Provider
Provider's assigned bookings.

### GET `/bookings/pending` — Provider
Unassigned pending bookings (job queue).

### GET `/bookings/:id` — Auth required
Get booking by ID (ownership checked).

### PUT `/bookings/:id/status` — Customer | Provider | Admin
```json
{ "status": "accepted" }
```

### PUT `/bookings/:id/reject` — Provider
Decline a pending unassigned booking (hidden from that provider's queue; booking stays pending for others).

### PUT `/bookings/:id/work-done` — Customer | Provider | Admin
Mark your side of work as done. When **both** provider and customer confirm during `in_progress`, status moves to `awaiting_payment`.

### POST `/bookings/:id/pay` — Customer
Mock payment (no Stripe). Use test card `4242424242424242`.
```json
{ "cardNumber": "4242424242424242", "cardHolder": "John Doe", "expiry": "12/28", "cvv": "123" }
```

**Full status flow:**
1. `pending` — customer created booking
2. `accepted` — provider accepted (or admin assigned)
3. `in_progress` — provider started job
4. `awaiting_payment` — both parties marked work done
5. `completed` — customer paid (mock payment successful)
6. `cancelled` — customer cancelled while pending
7. `rejected` — reserved enum value (provider decline uses per-provider hide, not global reject)

**Role actions:**
- **Customer:** cancel pending · mark work done · mock pay when awaiting payment
- **Provider:** accept/reject pending · start job · mark work done
- **Admin:** override status · assign provider · mark work done · mock pay

### GET `/bookings` — Admin

---

## Provider Availability

### POST `/availability` — Provider
```json
{ "dayOfWeek": 1, "startTime": "09:00:00", "endTime": "17:00:00" }
```

### GET `/availability/my` — Provider
### PUT `/availability/:id` — Provider
### DELETE `/availability/:id` — Provider

---

## Admin

All admin routes require **Admin** role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/dashboard` | Stats: users, bookings, services counts |
| GET | `/admin/users` | List users (`?role=customer\|provider`) |
| POST | `/admin/users` | Create user |
| GET | `/admin/users/:id` | User detail |
| PUT | `/admin/users/:id` | Update user |
| PATCH | `/admin/users/:id/status` | `{ "status": "active\|blocked" }` |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/bookings` | All bookings |
| GET | `/admin/bookings/:id` | Booking detail |
| PATCH | `/admin/bookings/:id/status` | Update status |
| PATCH | `/admin/bookings/:id/assign` | `{ "providerId": 2 }` |
| PUT | `/admin/bookings/:id/work-done` | Mark work done (admin) |
| POST | `/admin/bookings/:id/pay` | Mock payment (admin) |
| GET/POST/PUT/DELETE | `/admin/services` | Service CRUD |
| GET/POST/PUT/DELETE | `/admin/service-categories` | Category CRUD |

---

## Roles

| Role | Value |
|------|-------|
| Customer | `customer` |
| Provider | `provider` |
| Admin | `admin` |

---

## Sample Credentials (after `npm run seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Customer | customer@example.com | customer123 |
| Provider | provider@example.com | provider123 |

---

## Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ondemand_services
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
```

## Database Schema

See `database/schema.sql` for the full relational schema.
