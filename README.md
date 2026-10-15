# ShopNest — Full-Stack E-Commerce Platform (MERN)

> **Everyday essentials, premium picks.**  
> A full-stack, production-grade e-commerce application connecting a modern **React 18 + Vite + Material UI** storefront to an **Express 5 + MongoDB** backend API.

---

## 🚀 Highlights & Data Summary

- **200 Products Across 10 Categories**: Fully ingested from `crazy.json` and served dynamically through `/api/products` and the React frontend.
- **10 Curated Categories**:
  1. `Clothing`
  2. `Electronics`
  3. `Mobiles`
  4. `Laptops`
  5. `Footwear`
  6. `Home & Kitchen`
  7. `Beauty & Personal Care`
  8. `Sports & Fitness`
  9. `Books`
  10. `Furniture`
- **4 Configured User Accounts** (1 Admin + 3 Customers): Ready for immediate login and testing.
- **Connected Architecture**: Frontend services (`productService`, `authService`, `orderService`, `userService`, `contentService`) make real HTTP calls to the Express backend with automatic JWT bearer authentication, resilient fallback, and error handling.
- **Resilient MongoDB Layer**: Connects to MongoDB Atlas when available; automatically falls back to local MongoDB (`127.0.0.1:27017`) or built-in in-memory fallback so the application **never crashes** on startup.

---

## 🔑 User Accounts & Login Credentials

All 4 accounts are pre-configured. On the login page (`/login`), click the **Admin** or **Customer** quick-fill button to sign in with one click.

| Role | Name | Email | Password | Phone | Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Parth Abhale | `abhale.parth07@gmail.com` | `Parth@1234` | `9876543210` | Full store access, Admin Dashboard (`/admin`), inventory management, customer insights |
| **Customer** | Aarav Sharma | `demo@example.com` | `password123` | `9845012345` | Shopping, cart, checkout, saved addresses, order tracking, reviews |
| **Customer** | Priya Sharma | `priya.sharma@example.com` | `password123` | `9845012346` | Full customer checkout & account management |
| **Customer** | Rohan Mehta | `rohan.mehta@example.com` | `password123` | `9845012347` | Full customer checkout & account management |

---

## ⚙️ Quick Start Guide

### Prerequisites
- Node.js 18+ and npm installed on your machine.

### 1. Install Dependencies
```bash
# In project root:
npm install

# In backend folder:
cd backend
npm install
cd ..
```

### 2. Run Both Backend and Frontend Together (Recommended)
```bash
npm run dev:all
```
This runs:
- **Backend API Server**: `http://localhost:8000`
- **Frontend Vite Storefront**: `http://localhost:5173`

### Or Run Individually
```bash
# Terminal 1 — Start Backend Server:
npm run dev:backend
# or cd backend && npm start

# Terminal 2 — Start Frontend Server:
npm run dev
```

### 3. Seed Database (Optional)
To re-seed or populate your live MongoDB instance with the 200 products, 10 categories, 4 users, and dummy data:
```bash
npm run seed
```

---

## 📁 Project Architecture

```
shopnest/
├── backend/                        # Node.js + Express backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Resilient MongoDB Atlas / local / fallback connection
│   │   ├── controllers/            # Route controllers
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── content.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── return.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/             # Auth JWT verification & central error handler
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── ProductSchema.js    # Schema for the 200 products
│   │   │   ├── CategorySchema.js   # Schema for 10 categories
│   │   │   ├── UserSchema.js       # Schema for customers & admin
│   │   │   ├── OrderSchema.js
│   │   │   ├── AddressSchema.js
│   │   │   └── ...
│   │   ├── routes/                 # Express API routes (/api/...)
│   │   ├── seed/
│   │   │   └── seedData.js         # Automated MongoDB seeder script
│   │   ├── utils/
│   │   │   ├── crazy.json          # 200 products across 10 categories
│   │   │   ├── inMemoryStore.js    # Data store & offline fallback handler
│   │   │   └── jwt.js              # Token signing and verification
│   │   ├── app.js                  # Express app with CORS and middleware
│   │   └── server.js               # Server entry point (port 8000)
│   ├── .env                        # Environment variables
│   └── package.json
│
├── src/                            # React 18 + Vite frontend
│   ├── components/                 # Reusable UI components
│   ├── context/                    # AuthContext, CartContext, ThemeContext, etc.
│   ├── data/
│   │   └── categories.js           # 10 categories definitions matching crazy.json
│   ├── pages/
│   │   ├── admin/                  # Admin dashboard, products list, customers
│   │   ├── auth/                   # Sign in, sign up, email verify, password reset
│   │   ├── shop/                   # Catalogue, Category view, Product detail
│   │   └── ...
│   ├── services/                   # Connected API client & service layers
│   │   ├── apiClient.js            # Fetch wrapper with JWT headers & error handling
│   │   ├── authService.js          # /api/auth integration
│   │   ├── productService.js       # /api/products integration
│   │   ├── orderService.js         # /api/orders integration
│   │   ├── userService.js          # /api/users/me integration
│   │   └── contentService.js       # /api/content integration
│   ├── App.jsx                     # Routes & layout wrapper
│   └── main.jsx
│
├── index.html
├── vite.config.js                  # Vite config with /api proxy to localhost:8000
└── package.json
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all 10 categories | No |
| `GET` | `/api/categories/:slug` | Retrieve single category by slug | No |
| `GET` | `/api/products` | Filtered, sorted, paginated product list | No |
| `GET` | `/api/products/all` | Full list of 200 products | No |
| `GET` | `/api/products/:id` | Single product details | No |
| `GET` | `/api/products/slug/:slug` | Product lookup by slug | No |
| `POST` | `/api/products/batch` | Batch fetch products by array of IDs | No |
| `POST` | `/api/products/:id/check-delivery` | Pincode delivery estimation | No |
| `POST` | `/api/auth/signup` | Create customer account | No |
| `POST` | `/api/auth/login` | Authenticate (Customer / Admin) | No |
| `GET` | `/api/orders` | Current user's order history | Bearer Token |
| `POST` | `/api/orders` | Place new order | Bearer Token |
| `PATCH` | `/api/orders/:id/cancel` | Cancel an order | Bearer Token |
| `GET` | `/api/orders/:id/tracking` | Order shipment tracking timeline | Bearer Token |
| `GET` | `/api/users/me/addresses` | User's saved delivery addresses | Bearer Token |
| `GET` | `/api/users/me/cards` | User's saved payment methods | Bearer Token |
| `GET` | `/api/admin/customers` | Admin: list customers | Admin Token |
| `GET` | `/api/admin/analytics/summary` | Admin: revenue, order, customer KPIs | Admin Token |
