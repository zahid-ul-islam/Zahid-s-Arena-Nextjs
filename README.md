# Zahid's Arena - Modern Football Kits E-Commerce Platform

A full-stack e-commerce application for selling football kits, built with Next.js 16, TypeScript, Tailwind CSS, Express, and MongoDB.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb)

## 🚀 Features

### User Features
- **Browse Products**: View all available football kits with filtering by league/team
- **Product Details**: Detailed product pages with size selection
- **Shopping Cart**: Add items to cart with local storage persistence
- **Checkout**: Complete order with form validation (Zod + React Hook Form)
- **Responsive Design**: Modern, mobile-first UI with glassmorphism effects

### Admin Features
- **Dashboard**: View sales statistics and key metrics
- **Product Management**: Create, edit, and delete products
- **Order Management**: View all orders and update order status
- **Unified App**: Both user and admin features in a single application

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend
- **Express** - Custom server for API routes
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Custom Server Integration** - Express + Next.js in one app

### Key Features
- **Server-Side Rendering (SSR)**: Product pages rendered on server
- **Streaming**: React Suspense for loading states
- **Caching**: Next.js `unstable_cache` for product data
- **Context API**: Client-side cart state management

## 📂 Project Structure

\`\`\`
portfolio-next/
├── server.ts                    # Custom Express server
├── scripts/
│   └── seed.ts                  # Database seed script
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Home page
│   │   ├── shop/                # Shop page
│   │   ├── product/[id]/        # Product details
│   │   ├── cart/                # Shopping cart
│   │   ├── order-success/       # Order confirmation
│   │   └── admin/               # Admin panel
│   │       ├── page.tsx         # Dashboard
│   │       ├── products/        # Product management
│   │       └── orders/          # Order management
│   ├── components/              # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── FeaturedKits.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── ProductForm.tsx
│   │   ├── DeleteProductButton.tsx
│   │   └── OrderStatusUpdater.tsx
│   ├── context/
│   │   └── CartContext.tsx      # Cart state management
│   ├── models/                  # Mongoose models
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Order.ts
│   ├── server/                  # Express routes
│   │   └── routes/
│   │       ├── products.ts
│   │       └── orders.ts
│   └── lib/
│       └── db.ts                # MongoDB connection utility
└── package.json
\`\`\`

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas URI)

### 1. Clone & Install Dependencies

\`\`\`bash
cd portfolio-next
npm install
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/football-kits-ecommerce
PORT=3000
NODE_ENV=development
\`\`\`

### 3. Seed Database

Populate the database with sample products:

\`\`\`bash
npm run seed
\`\`\`

This will create:
- 6 sample football kits
- 1 admin user (admin@kits.co / admin123)

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Application Flow

### User Journey

1. **Home Page** → View hero section and featured products (4 kits)
2. **Shop Page** → Browse all products with filtering options
3. **Product Details** → Select size and add to cart
4. **Cart Page** → Review items, adjust quantities, proceed to checkout
5. **Checkout** → Fill shipping form (validated with Zod)
6. **Order Success** → Confirmation page

### Admin Journey

1. **Admin Dashboard** (`/admin`) → View statistics (revenue, orders, products)
2. **Manage Products** → Create, edit, or delete football kits
3. **Manage Orders** → View all orders and update status

### Data Flow

\`\`\`mermaid
graph LR
    A[Browser] --> B[Next.js App]
    B --> C[Express Server]
    C --> D[MongoDB]
    D --> C
    C --> B
    B --> A
\`\`\`

1. **Client Request** → Next.js receives page request
2. **Server Components** → Fetch data from MongoDB via Mongoose
3. **Express API Routes** → Handle mutations (create/update/delete)
4. **Caching** → Featured products cached for 1 hour
5. **Cart State** → Managed client-side with Context API + localStorage

## 🔐 Authentication

**Note**: This demo uses a simplified authentication approach. For production:
- Implement **NextAuth.js** (Auth.js v5)
- Add middleware to protect admin routes
- Hash passwords with **bcryptjs**
- Use JWT tokens for session management

Current setup:
- Admin routes are publicly accessible
- User ID is hardcoded in checkout (for demo purposes)

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with gradients and animations
- **Glassmorphism**: Backdrop blur effects on navbar
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Dark Mode**: Automatic dark mode support via CSS variables
- **Micro-interactions**: Hover effects, transitions, and loading states

## 🧪 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/my-orders?userId=:id` - Get user orders
- `PUT /api/orders/:id/status` - Update order status (Admin)

## 📊 Database Schema

### User
\`\`\`typescript
{
  name: string
  email: string (unique)
  password?: string
  role: 'admin' | 'user'
  image?: string
  timestamps
}
\`\`\`

### Product
\`\`\`typescript
{
  name: string
  description: string
  price: number
  image: string
  category: string (league)
  team: string
  sizes: string[]
  stock: number
  isFeatured: boolean
  timestamps
}
\`\`\`

### Order
\`\`\`typescript
{
  user: ObjectId (ref: User)
  products: [{
    product: ObjectId (ref: Product)
    quantity: number
    size: string
  }]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  address: {
    street, city, state, zip, country
  }
  timestamps
}
\`\`\`

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Deployment Platforms
- **Vercel**: Best for Next.js (requires MongoDB Atlas)
- **Railway**: Supports custom servers + MongoDB
- **Render**: Full-stack deployment

**Important**: Update \`MONGODB_URI\` to your production database (MongoDB Atlas recommended).

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize!

## 📝 License

MIT License - Free to use for personal and commercial projects.

---

**Built with ❤️ using Next.js, Express, and MongoDB**
