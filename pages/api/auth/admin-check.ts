import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminFromSession } from "@/lib/auth/is-admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { redis } from "@/lib/redis";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 300; // 5 minutes en secondes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;

  if (!email) {
    return res.status(404).end(); // Hide this route's existence
  }

  const ip = getClientIp(req);

  const failKey = `admin:fail:${email}:${ip}`;
  const blockKey = `admin:block:${email}:${ip}`;

  const isBlocked = await redis.exists(blockKey);
  if (isBlocked) {
    return res.status(404).end(); // Pretend this route doesn’t exist
  }

  const isAdmin = await isAdminFromSession(req, res);

  if (!isAdmin) {
    const attempts = await redis.incr(failKey);

    if (attempts === 1) {
      await redis.expire(failKey, BLOCK_DURATION);
    }

    if (attempts >= MAX_ATTEMPTS) {
      await redis.set(blockKey, "1", { ex: BLOCK_DURATION });
    }

    return res.status(404).end(); // Stealth fail
  }

  // Si c’est un admin légitime, on efface ses erreurs
  await redis.del(failKey);
  await redis.del(blockKey);

  return res.status(200).json({ isAdmin: true });
}

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