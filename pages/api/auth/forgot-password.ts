import { prisma } from "@/lib/prisma";
import { resend } from '@/lib/resend'
import { randomBytes } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { passwordResetTemplate } from "@/templates/forgot-password";
import { verifyCaptcha } from "@/lib/captcha";
import { redis } from "@/lib/redis";

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 60 * 15; // 15 minutes
const COOLDOWN_DURATION = 60 * 5; // 5 minutes entre deux emails

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, captcha } = req.body;
    if (!email || !captcha) {
        return res.status(400).json({ message: "Email et captcha requis." });
    }

    const isHuman = await verifyCaptcha(captcha);
    if (!isHuman.success || isHuman.score < 0.5) {
        return res.status(400).json({ message: "Échec de la vérification captcha." });
    }

    const blockKey = `reset:block:${email}`;
    const cooldownKey = `reset:cooldown:${email}`;
    const attemptsKey = `reset:attempts:${email}`;

    const isBlocked = await redis.exists(blockKey);
    if (isBlocked) {
        return res.status(429).json({ message: "Trop de tentatives. Réessaie plus tard." });
    }

    const isOnCooldown = await redis.exists(cooldownKey);
    if (isOnCooldown) {
        return res.status(429).json({ message: "Tu dois attendre avant de redemander un email." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Toujours répondre pareil (éviter l’énumération)
    const genericResponse = { message: "Email envoyé si le compte existe." };

    if (!user) {
        return res.status(200).json(genericResponse);
    }

    const attempts = await redis.incr(attemptsKey);
    if (attempts === 1) {
        await redis.expire(attemptsKey, BLOCK_DURATION);
    }

    if (attempts >= MAX_ATTEMPTS) {
        await redis.set(blockKey, "1", { ex: BLOCK_DURATION });
        return res.status(429).json({ message: "Trop de tentatives. Réessaie plus tard." });
    }

    // Appliquer cooldown avant d’envoyer un nouveau mail
    await redis.set(cooldownKey, "1", { ex: COOLDOWN_DURATION});

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
    const url = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${email}`;

    const { html, subject } = passwordResetTemplate({ url, email });

    await prisma.passwordResetToken.create({
        data: {
            token,
            email,
            expires,
        },
    });

    const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
    await resend.emails.send({
        from,
        to: email,
        subject,
        html,
    });

    return res.status(200).json(genericResponse);
}
