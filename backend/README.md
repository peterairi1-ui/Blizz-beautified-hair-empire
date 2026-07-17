# Blizz Beautified Hair Empire Backend

This backend powers the Blizz Beautified Hair Empire storefront with secure authentication, product management, orders, appointments, newsletter subscriptions, and image uploads.

## Quick start

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Create or seed the admin account: `npm run seed:admin`
4. Start development server: `npm run dev`

## Admin setup

The backend supports a secure administrator account.

- Admin login URL: `/admin/login` (POST)
- Protected admin dashboard: `/admin/dashboard` (GET)
- Default admin email: `admin@blizzbeautified.com`
- If `DEFAULT_ADMIN_PASSWORD` is not set in `.env`, a temporary password is generated on first seed and written to `backend/logs/admin-credentials.txt`.

## Main routes

- `/api/auth/*` for customer authentication
- `/api/admin/auth/*` for admin authentication
- `/api/products/*` for product catalog management
- `/api/orders/*` for order management
- `/api/appointments/*` for appointments
- `/api/contact/*` for contact form submissions
- `/api/newsletter/*` for newsletter subscriptions
- `/api/gallery/*` for gallery images
