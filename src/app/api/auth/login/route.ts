import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { redis, userKey, dataKey } from "@/lib/redis";
import { signToken } from "@/lib/jwt";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user from Redis
    const storedUser = await redis.get<StoredUser>(userKey(normalizedEmail));
    if (!storedUser) {
      return NextResponse.json(
        { error: "No account found with this email. Please sign up first." },
        { status: 404 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, storedUser.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = signToken({ userId: storedUser.id, email: normalizedEmail });

    // Fetch saved cloud data if it exists
    const cloudData = await redis.get(dataKey(storedUser.id));

    return NextResponse.json({
      token,
      user: {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        createdAt: storedUser.createdAt,
      },
      cloudData: cloudData || null,
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
