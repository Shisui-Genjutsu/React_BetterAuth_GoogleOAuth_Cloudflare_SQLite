# 🔐 React + Better Auth + Google OAuth + Cloudflare

A modern, full-stack authentication system built with React, Better Auth, and deployed on Cloudflare infrastructure. Features email whitelisting, Google OAuth, and a beautiful glassmorphic UI.

![Sign In Preview](./preview.png)

## ✨ Features

### 🎨 **Modern UI/UX**
- Clean, minimalist sign-in page with glassmorphism design
- Purple gradient background with smooth animations
- Responsive design that works on all devices
- Loading states and error handling with visual feedback

### 🔒 **Secure Authentication**
- Google OAuth integration via Better Auth
- Email whitelist system for controlled access
- Secure cookie-based sessions with `SameSite=None` and `secure` flags
- Custom error handling and user-friendly error pages

### ☁️ **Cloudflare-Powered Backend**
- Cloudflare Workers for serverless API
- D1 SQLite database for data persistence
- Drizzle ORM for type-safe database operations
- Global edge network for low latency

### 🛠️ **Developer Experience**
- TypeScript for type safety across the stack
- Hot module replacement with Vite
- Automated database migrations with Drizzle Kit
- Environment-based configuration

---

## 🏗️ Architecture

```
BaGOuthApp/
├── ba-gouth-app/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── routes/        # Page components
│   │   │   ├── SignIn.tsx
│   │   │   ├── AuthError.tsx
│   │   │   └── Blog.tsx
│   │   └── lib/
│   │       └── auth-client.ts  # Better Auth client
│   └── package.json
│
└── ba-gouth-apis/         # Backend (Cloudflare Workers + Hono)
    ├── src/
    │   ├── index.ts       # API routes & auth configuration
    │   └── schemas/       # Drizzle ORM schemas
    ├── migrations/        # Database migrations
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Google Cloud Console](https://console.cloud.google.com/) project with OAuth credentials

### 1. Clone the Repository

```bash
git clone https://github.com/Shisui-Genjutsu/React_BetterAuth_GoogleOAuth_Cloudflare_SQLite.git
cd React_BetterAuth_GoogleOAuth_Cloudflare_SQLite
```

### 2. Setup Backend (ba-gouth-apis)

```bash
cd ba-gouth-apis
bun install  # or npm install
```

#### Configure Environment Variables

Create a `wrangler.jsonc` file:

```jsonc
{
  "name": "ba-gouth-apis",
  "main": "src/index.ts",
  "compatibility_date": "2024-01-01",
  "vars": {
    "CLOUDFLARE_BASE_URL": "https://your-worker.workers.dev",
    "CLOUDFLARE_FRONTEND_BASE_URL": "https://your-app.pages.dev"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "ba-gouth-db",
      "database_id": "your-database-id"
    }
  ],
  "secrets": [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
  ]
}
```

#### Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Authorized JavaScript origins**: `http://localhost:5173`, `https://your-app.pages.dev`
   - **Authorized redirect URIs**: `https://your-worker.workers.dev/api/auth/callback/google`

#### Add Secrets to Cloudflare

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

#### Create D1 Database

```bash
npx wrangler d1 create ba-gouth-db
```

Copy the database ID to your `wrangler.jsonc`.

#### Run Migrations

```bash
bun run db:generate  # Generate migrations
bun run db:push      # Apply to local DB
npx wrangler d1 execute ba-gouth-db --remote --file=./migrations/0000_*.sql
npx wrangler d1 execute ba-gouth-db --remote --file=./migrations/0001_*.sql
```

#### Add Whitelisted Emails

```bash
npx wrangler d1 execute ba-gouth-db --remote --command="INSERT INTO allowed_emails (id, email, created_at) VALUES ('uuid-here', 'your-email@gmail.com', datetime('now'))"
```

#### Deploy Backend

```bash
bun run deploy
```

### 3. Setup Frontend (ba-gouth-app)

```bash
cd ../ba-gouth-app
bun install  # or npm install
```

#### Configure Environment Variables

Create a `.env` file:

```env
VITE_BETTER_AUTH_URL=https://your-worker.workers.dev
```

#### Run Development Server

```bash
bun run dev
```

Visit `http://localhost:5173/sign-in`

#### Deploy Frontend

```bash
bun run deploy
```

---

## 📊 Database Schema

### `user` Table
- `id`: User ID (primary key)
- `name`: User's full name
- `email`: User's email address
- `emailVerified`: Email verification status
- `image`: Profile picture URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### `session` Table
- `id`: Session ID (primary key)
- `expiresAt`: Session expiration time
- `token`: Session token
- `ipAddress`: User's IP address
- `userAgent`: Browser user agent
- `userId`: Foreign key to `user` table

### `account` Table
- `id`: Account ID (primary key)
- `accountId`: OAuth provider account ID
- `providerId`: OAuth provider (e.g., "google")
- `userId`: Foreign key to `user` table
- `accessToken`: OAuth access token
- `refreshToken`: OAuth refresh token
- `expiresAt`: Token expiration time

### `allowed_emails` Table (Custom)
- `id`: Record ID (primary key)
- `email`: Whitelisted email address
- `created_at`: Timestamp when email was added

---

## 🔧 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Better Auth Client** - Authentication SDK

### Backend
- **Cloudflare Workers** - Serverless runtime
- **Hono** - Lightweight web framework
- **Better Auth** - Authentication framework
- **Drizzle ORM** - Type-safe database toolkit
- **D1** - Cloudflare's SQLite database

---

## 🎯 Key Implementation Details

### Email Whitelist Plugin

The backend uses a custom Better Auth plugin to enforce email whitelisting:

```typescript
const emailWhitelistPlugin = (db: any) => ({
  id: "email-whitelist",
  init: (instance: any) => {
    return {
      options: {
        databaseHooks: {
          user: {
            create: {
              async before(user: any) {
                const email = user.email.toLowerCase()
                const allowedUser = await db.select()
                  .from(schema.allowedEmails)
                  .where(eq(schema.allowedEmails.email, email))
                  .limit(1)

                if (!allowedUser || allowedUser.length === 0) {
                  const error: any = new Error("unauthorized_email")
                  error.status = 403
                  throw error
                }
                return user
              }
            }
          }
        }
      }
    }
  }
})
```

### CORS Configuration

Configured for cross-origin requests with credentials:

```typescript
app.use(cors({
  origin: (origin, c) => {
    const allowedOrigins = [
      "http://localhost:5173",
      c.env.CLOUDFLARE_FRONTEND_BASE_URL
    ];
    return origin && allowedOrigins.some(allowed => origin.includes(allowed)) ? origin : null;
  },
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'cookie'],
  credentials: true,
  exposeHeaders: ["set-cookie"]
}))
```

---

## 🐛 Troubleshooting

### "Email not authorized" Error
- Ensure your email is added to the `allowed_emails` table in D1
- Check that the email matches exactly (case-insensitive comparison is used)

### CORS Errors
- Verify `CLOUDFLARE_FRONTEND_BASE_URL` is set correctly in `wrangler.jsonc`
- Check that your frontend URL is in the `trustedOrigins` array

### Database Connection Issues
- Confirm D1 database is created and bound correctly
- Verify migrations have been applied to the remote database
- Check database ID in `wrangler.jsonc` matches your D1 database

### OAuth Redirect Issues
- Ensure redirect URIs in Google Console match your worker URL exactly
- Check that `baseURL` and `basePath` are configured correctly in Better Auth

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Shisui-Genjutsu/React_BetterAuth_GoogleOAuth_Cloudflare_SQLite/issues).

---

## 👤 Author

**Bhaskar G**

- GitHub: [@Shisui-Genjutsu](https://github.com/Shisui-Genjutsu)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

### Error Handling
The application includes a dedicated error page for authentication failures with clear messaging and navigation options.

---

**Built with ❤️ using React, Better Auth, and Cloudflare**
