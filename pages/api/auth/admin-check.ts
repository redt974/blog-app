import { isAdminFromSession } from "@/lib/auth/is-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await isAdminFromSession(req, res);
  res.status(200).json({ isAdmin });
}
