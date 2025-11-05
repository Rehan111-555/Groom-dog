import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ========== helpers ========== */
const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}
async function sendEmail({ to, subject, html }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "No-Reply <no-reply@example.com>";

  if (!host || !user || !pass) {
    console.log("[EMAIL Fallback]", { to, subject, html });
    return;
  }

  const transport = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({ from, to, subject, html });
}

/* ========== GET: handle verify / reset link redirects ========== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const verify = searchParams.get("verify");
    const reset = searchParams.get("reset");

    if (verify) {
      const vt = await prisma.verificationToken.findUnique({ where: { token: verify } });
      if (!vt || vt.expires < new Date() || !vt.identifier?.startsWith("verify:")) {
        return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 400 });
      }
      const email = vt.identifier.replace(/^verify:/, "");
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
      }
      await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
      await prisma.verificationToken.delete({ where: { token: verify } });
      return NextResponse.redirect(`${appUrl}/signin?verified=1`);
    }

    if (reset) {
      return NextResponse.redirect(`${appUrl}/signin?resetToken=${encodeURIComponent(reset)}`);
    }

    return NextResponse.json({ ok: false, error: "Missing action" }, { status: 400 });
  } catch (e) {
    console.error("REGISTER_GET_ERROR", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/* ========== POST: register / requestReset / confirmReset ========== */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body?.action || "register";

    if (action === "requestReset") {
      const email = String(body?.email || "").toLowerCase().trim();
      if (!email) return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });

      const user = await prisma.user.findUnique({ where: { email } });
      // Always return ok to avoid account enumeration
      if (user) {
        const t = makeToken();
        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
        await prisma.verificationToken.create({
          data: { identifier: `reset:${email}`, token: t, expires },
        });
        const link = `${appUrl}/api/register?reset=${encodeURIComponent(t)}`;
        await sendEmail({
          to: email,
          subject: "Reset your password",
          html: `<p>Click to reset your password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 30 minutes.</p>`,
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "confirmReset") {
      const resetToken = String(body?.token || "");
      const newPassword = String(body?.password || "");
      if (!resetToken || !newPassword) {
        return NextResponse.json({ ok: false, error: "Missing token or password" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
      }

      const vt = await prisma.verificationToken.findUnique({ where: { token: resetToken } });
      if (!vt || vt.expires < new Date() || !vt.identifier?.startsWith("reset:")) {
        return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 400 });
      }
      const email = vt.identifier.replace(/^reset:/, "");
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
      await prisma.verificationToken.delete({ where: { token: resetToken } });
      return NextResponse.json({ ok: true });
    }

    // default: register
    const { name, email, password, phone } = body || {};
    const cleanEmail = String(email || "").toLowerCase().trim();
    const cleanPhone = phone ? String(phone).trim() : null;

    if (!cleanEmail || !password) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (exists?.passwordHash) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    if (exists) {
      user = await prisma.user.update({
        where: { email: cleanEmail },
        data: { name: name || exists.name, passwordHash, phone: cleanPhone ?? exists.phone ?? null },
      });
    } else {
      user = await prisma.user.create({
        data: { name: name || null, email: cleanEmail, passwordHash, phone: cleanPhone },
      });
    }

    // Email verification token
    const t = makeToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    await prisma.verificationToken.create({
      data: { identifier: `verify:${cleanEmail}`, token: t, expires },
    });

    const link = `${appUrl}/api/register?verify=${encodeURIComponent(t)}`;
    await sendEmail({
      to: cleanEmail,
      subject: "Verify your email",
      html: `<p>Hi${name ? " " + name : ""},</p><p>Confirm your email to finish setting up your account:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p>`,
    });

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
