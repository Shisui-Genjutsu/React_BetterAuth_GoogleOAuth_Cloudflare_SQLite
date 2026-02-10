// app.on(['POST', 'GET'], '/api/auth/**', (c) => {
//   const db = drizzle(c.env.DB, { schema })
//   const auth = betterAuthAdapter({
//     database: drizzleAdapter(db, {
//       provider: "sqlite",
//       schema: schema,
//     }),
//     socialProviders: {
//       google: {
//         prompt: "select_account",
//         clientId: c.env.GOOGLE_CLIENT_ID,
//         clientSecret: c.env.GOOGLE_CLIENT_SECRET,
//       }
//     },
//     trustedOrigins: [
//       "http://localhost:5173",
//       "https://ba-gouth-app.pages.dev"
//     ],
//     advanced: {
//       defaultCookieAttributes: {
//         sameSite: "None",
//         secure: true,
//       },
//     },
//   })
//   return auth.handler(c.req.raw)
// })
