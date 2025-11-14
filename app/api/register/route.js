// app/api/register/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/** Prisma singleton to prevent too many connections */
const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePhone(raw) {
  const cleaned = String(raw || "").trim();
  const plus = cleaned.startsWith("+") ? "+" : "";
  const digits = cleaned.replace(/[^\d]/g, "");
  return plus + digits;
}

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();
    const cleanEmail = String(email || "").toLowerCase().trim();
    const cleanPhone = normalizePhone(phone);

    if (!cleanEmail || !password || !cleanPhone) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
    }
    if (cleanPhone.length < 7 || cleanPhone.length > 20) {
      return NextResponse.json({ ok: false, error: "Invalid phone number" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (exists?.passwordHash) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }

    const phoneTaken = await prisma.user.findFirst({
      where: { phone: cleanPhone },
      select: { id: true },
    });
    if (phoneTaken) {
      return NextResponse.json({ ok: false, error: "Phone already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    if (exists) {
      user = await prisma.user.update({
        where: { email: cleanEmail },
        data: { name: name || exists.name, passwordHash, phone: cleanPhone },
      });
    } else {
      user = await prisma.user.create({
        data: { name: name || null, email: cleanEmail, passwordHash, phone: cleanPhone },
      });
    }

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
