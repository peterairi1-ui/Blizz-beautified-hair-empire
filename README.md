# Blizz Beautified Hair Empire

This repository contains the frontend and backend for the Blizz Beautified Hair Empire storefront.

## Backend

The backend provides secure JWT-based authentication for customers and administrators, product management, order processing, contact forms, gallery content, and more.

### Admin account setup

1. Copy `backend/.env.example` to `backend/.env`
2. Set `MONGODB_URI` in `backend/.env`
3. Run `npm install` inside `backend`
4. Seed the admin account:
   ```bash
   cd backend
   npm run seed:admin
   ```
5. The admin login endpoint is `http://localhost:5000/admin/login`
6. The protected admin dashboard endpoint is `http://localhost:5000/admin/dashboard`

If `DEFAULT_ADMIN_PASSWORD` is not set, a temporary password is generated and saved to `backend/logs/admin-credentials.txt`.

### Admin credentials

- Default email: `admin@blizzbeautified.com`
- Login path: `/admin/login`
- Dashboard path: `/admin/dashboard`

## Frontend

The frontend is a React + Vite app.

### Run locally

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:5000` in development.
