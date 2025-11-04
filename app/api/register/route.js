// app/api/register/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const cleanEmail = String(email || "").toLowerCase().trim();
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

    // Either create or upgrade an existing OAuth-only user
    let user;
    if (exists) {
      user = await prisma.user.update({
        where: { email: cleanEmail },
        data: { name: name || exists.name, passwordHash },
      });
    } else {
      user = await prisma.user.create({
        data: { name: name || null, email: cleanEmail, passwordHash },
      });
    }

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
