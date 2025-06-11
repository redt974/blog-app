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
    return res.status(200).json({ reason: "unauthenticated" });
  }

  const failKey = `admin:fail:${email}`;
  const blockKey = `admin:block:${email}`;

  const isBlocked = await redis.exists(blockKey);
  if (isBlocked) {
    return res.status(429).end();
  }

  const isAdmin = await isAdminFromSession(req, res);

  if (!isAdmin) {
    const attempts = await redis.incr(failKey);

    if (attempts === 1) {
      await redis.expire(failKey, BLOCK_DURATION);
    }

    if (attempts >= MAX_ATTEMPTS) {
      await redis.set(blockKey, "1", { ex: BLOCK_DURATION });
      return res.status(403).end();
    }

    return res.status(403).end();
  }

  // Si c’est un admin légitime, on efface ses erreurs
  await redis.del(failKey);
  await redis.del(blockKey);

  return res.status(200).json({ isAdmin: true });
}
