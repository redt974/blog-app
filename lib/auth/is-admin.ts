import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import type { GetServerSidePropsContext } from "next";

export async function isAdminFromSession(
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"]
): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);

  const email = session?.user?.email;
  if (!email) return false;

  const hash = crypto.createHash("sha256").update(email).digest("hex");
  return hash === process.env.ADMIN_EMAIL_HASH;
}

