import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import bcrypt from "bcryptjs"
import { verifyCaptcha } from "@/lib/captcha"
import { NextApiRequest } from "next"

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 60 * 5; // 5 minutes

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captcha: { label: "Captcha", type: "text" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password;
        const captcha = credentials?.captcha;

        if (!email || !password || !captcha) throw new Error("Champs requis manquants");

        const ip = getClientIp(req);

        // Verify captcha
        const isHuman = await verifyCaptcha(captcha);
        if (!isHuman.success || isHuman.score < 0.5) {
          throw new Error("Échec de la vérification captcha.");
        }

        // Use both email and IP for rate limiting keys
        const failKey = `login:fail:${email}:${ip}`;
        const blockKey = `login:block:${email}:${ip}`;

        const isBlocked = await redis.exists(blockKey);
        if (isBlocked) {
          throw new Error("Trop de tentatives. Réessaie dans 5 minutes.");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        const isValid = user && user.password && await bcrypt.compare(password, user.password);

        if (!isValid) {
          const attempts = await redis.incr(failKey);

          if (attempts === 1) {
            await redis.expire(failKey, BLOCK_DURATION);
          }

          if (attempts >= MAX_ATTEMPTS) {
            await redis.set(blockKey, "1", { ex: BLOCK_DURATION });
            throw new Error("Compte temporairement bloqué suite à plusieurs tentatives.");
          }

          throw new Error("Identifiants incorrects");
        }

        if (!user.emailVerified) {
          throw new Error("Email non vérifié");
        }

        // Success: reset fail and block counters for this email+IP
        await redis.del(failKey);
        await redis.del(blockKey);

        // Log the IP somewhere, for audit or analytics
        await prisma.loginLog.create({ data: { userId: user.id, ip, timestamp: new Date() } });

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
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

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            name: profile?.name ?? `${profile?.given_name ?? ""} ${profile?.family_name ?? ""}`,
            emailVerified: new Date(),
            image: profile?.picture,
            accounts: {
              create: {
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
            },
          },
        })
      } else {
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

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      return session
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)

// Extract client IP from req (normalize IPv4-mapped IPv6)
function getClientIp(req: NextApiRequest): string {
  const xRealIp = req.headers["x-real-ip"];
  const xForwardedFor = req.headers["x-forwarded-for"];
  const remoteAddr = req.socket?.remoteAddress;

  let ip =
    typeof xRealIp === "string" && xRealIp
      ? xRealIp
      : typeof xForwardedFor === "string" && xForwardedFor
        ? xForwardedFor.split(",")[0].trim()
        : remoteAddr || "unknown";

  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  return ip;
}