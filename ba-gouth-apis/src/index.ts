import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { v4 as uuidv4 } from 'uuid'
import { betterAuth as betterAuthAdapter } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from './schemas'
import { eq } from 'drizzle-orm'

const app = new Hono<{
  Bindings: CloudflareBindings
}>()

// CORS
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

app.get('/', (c) => {
  return c.text('HI')
})

// Email whitelist plugin with better error message
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
                  // Throw a more specific error
                  const error: any = new Error("unauthorized_email")
                  error.status = 403
                  error.message = "Your email is not authorized to access this application. Please contact the administrator."
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

app.on(['POST', 'GET'], '/api/auth/**', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const auth = betterAuthAdapter({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: schema,
    }),
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
      }
    },
    trustedOrigins: [
      "http://localhost:5173",
      c.env.CLOUDFLARE_FRONTEND_BASE_URL
    ],
    baseURL: c.env.CLOUDFLARE_BASE_URL,
    basePath: "/api/auth",
    advanced: {
      defaultCookieAttributes: {
        sameSite: "None",
        secure: true,
      },
    },
    plugins: [
      emailWhitelistPlugin(db)
    ]
  })
  return auth.handler(c.req.raw)
})

export default app