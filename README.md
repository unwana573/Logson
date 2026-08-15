# Logson frontend

React + Vite + Tailwind + React Router frontend for the Logson software-license
marketplace. Wired to the FastAPI backend (see `../logson-backend`).

## Structure

```
src/
  assets/        static assets
  components/    reusable UI pieces (ProductCard, Navbar, Sidebar, ...)
    admin/       admin panel tabs
  hooks/         useAuth, useCart, useProducts, RequireAuth
  pages/         route-level pages (LandingPage, AuthPage, DashboardLayout, ...)
  services/      API layer (api.js base client + one file per resource)
  utils/         formatting helpers and shared constants
```

## Run locally

1. Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your running backend
   (defaults to `http://127.0.0.1:8000`). Set `VITE_GOOGLE_CLIENT_ID` if you want Google
   sign-in to work (see below) — leave it blank and the Google button just shows a
   "not configured" note instead of breaking anything.
2. Install and run:

```bash
npm install
npm run dev
```

Visit http://localhost:5173.

Make sure the backend is running too (see `../logson-backend/README.md`) --
this frontend does not work standalone, it calls the real API for auth,
products, search, orders, and admin actions.

## How the requirements map to code

- **First signup becomes admin / only an admin can promote another user** --
  enforced server-side (see backend). The frontend just reflects it:
  `AuthPage` shows a notice on the signup form, and `AdminUsers.jsx`'s
  "Make admin" button only exists inside the already admin-gated
  `AdminDashboardPage`.
- **Functional search bar** -- `TopBar.jsx` updates `searchQuery` in
  `DashboardLayout`, which `ProductsPage.jsx` passes into `useProducts.js`.
  That hook debounces the value and calls
  `GET /products?search=...` on the backend.
- **Amount spent instead of wallet funding** -- there's no wallet/fund UI at
  all. `TopBar.jsx` reads `user.amount_spent_kobo` straight from `/auth/me`,
  which the backend only increments on a confirmed order.
- **Manual or Paystack payment** -- `CartView.jsx`'s payment-method toggle
  creates an order via `POST /orders` with `payment_method: "manual" |
  "paystack"`, then either collects a proof URL (manual, pending admin
  approval) or redirects to Paystack's checkout (via
  `POST /orders/{id}/paystack/init`).

## Setting up Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an
   OAuth 2.0 Client ID of type "Web application".
2. Add your dev URL (`http://localhost:5173`) and production URL to "Authorized JavaScript origins".
3. Copy the client ID into `.env` as `VITE_GOOGLE_CLIENT_ID`, and into the backend's
   environment as `GOOGLE_CLIENT_ID` — they must be the same value.
4. `GoogleSignInButton.jsx` renders Google's own button via the Identity
   Services script loaded in `index.html`. On success it hands the ID token
   to `useAuth().googleAuth()`, which posts it to `POST /auth/google` —
   the backend is what actually verifies the token and decides whether
   this is a new account, a returning one, or should link to an existing
   email/password account.

## Build for production

```bash
npm run build
```

Output goes to `dist/`, ready to deploy to Vercel or any static host --
matches the deploy pattern you've used for your other Vite projects.
