import { NextRequest, NextResponse } from "next/server";
import { redis, userKey, dataKey } from "@/lib/redis";
import { signToken } from "@/lib/jwt";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  googleLinked?: boolean;
}

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  aud: string;
}

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Missing Google credential." },
        { status: 400 }
      );
    }

    // Verify the Google ID token using Google's tokeninfo endpoint
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!googleRes.ok) {
      return NextResponse.json(
        { error: "Invalid Google credential. Please try again." },
        { status: 401 }
      );
    }

    const payload: GoogleTokenPayload = await googleRes.json();

    // Verify the token audience matches our client ID
    const expectedClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (payload.aud !== expectedClientId) {
      return NextResponse.json(
        { error: "Token audience mismatch." },
        { status: 401 }
      );
    }

    if (!payload.email || !payload.email_verified) {
      return NextResponse.json(
        { error: "Google account email not verified." },
        { status: 401 }
      );
    }

    const normalizedEmail = payload.email.toLowerCase().trim();

    // Check if user already exists in Redis
    let storedUser = await redis.get<StoredUser>(userKey(normalizedEmail));
    let isNewUser = false;

    if (!storedUser) {
      // Create a new user (no password needed for Google-only accounts)
      isNewUser = true;
      storedUser = {
        id: `user-${Date.now()}`,
        name: payload.name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        passwordHash: "", // Google-only users have no password
        createdAt: new Date().toISOString(),
        googleLinked: true,
      };
      await redis.set(userKey(normalizedEmail), storedUser);
    } else {
      // Link Google to existing account if not already linked
      if (!storedUser.googleLinked) {
        storedUser.googleLinked = true;
        await redis.set(userKey(normalizedEmail), storedUser);
      }
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
      isNewUser,
    });
  } catch (err) {
    console.error("[google-auth]", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
