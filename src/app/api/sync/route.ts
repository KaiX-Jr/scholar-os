import { NextRequest, NextResponse } from "next/server";
import { redis, dataKey } from "@/lib/redis";
import { verifyToken } from "@/lib/jwt";

// PUT /api/sync — push local state to cloud
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await req.json();
    await redis.set(dataKey(payload.userId), body);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[sync PUT]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

// GET /api/sync — pull cloud state
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const cloudData = await redis.get(dataKey(payload.userId));
    return NextResponse.json({ cloudData: cloudData || null });
  } catch (err) {
    console.error("[sync GET]", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
