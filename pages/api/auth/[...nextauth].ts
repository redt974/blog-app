import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
// import AppleProvider from "next-auth/providers/apple"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
// import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// // Generate Apple client secret string
// const now = Math.floor(Date.now() / 1000)
// const appleClientSecret = jwt.sign(
//   {
//     iss: process.env.APPLE_TEAM_ID!,
//     iat: now,
//     exp: now + 60 * 60, // 1h de validité
//     aud: "https://appleid.apple.com",
//     sub: process.env.APPLE_CLIENT_ID!,
//   },
//   process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
//   {
//     algorithm: "ES256",
//     keyid: process.env.APPLE_KEY_ID!,
//   }
// )

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        })

        if (user && user.password && credentials?.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (isValid) {
            if (!user.emailVerified) {
              throw new Error("Email non vérifié")
            }
            return user
          }
        }

        return null
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // AppleProvider({
    //   clientId: process.env.APPLE_CLIENT_ID!,
    //   clientSecret: appleClientSecret,
    // }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "credentials") return true

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      // S'il y a déjà un utilisateur, on connecte l'account OAuth à ce user
      if (existingUser) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
          },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
