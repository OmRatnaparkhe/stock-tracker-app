import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const items = await Watchlist.find({ userId: session.user.id }).lean();

    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    console.error("Watchlist GET error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const symbol = String(body?.symbol || "").trim().toUpperCase();
    const company = String(body?.company || "").trim();

    if (!symbol || !company) {
      return NextResponse.json({ success: false, message: "symbol and company are required" }, { status: 400 });
    }

    await connectToDatabase();

    const doc = await Watchlist.findOneAndUpdate(
      { userId: session.user.id, symbol },
      { userId: session.user.id, symbol, company, $setOnInsert: { addedAt: new Date() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (e: any) {
    // Handle duplicate key errors gracefully
    if (e?.code === 11000) {
      return NextResponse.json({ success: true, message: "Already in watchlist" });
    }
    console.error("Watchlist POST error", e);
    return NextResponse.json({ success: false, message: "Failed to add to watchlist" }, { status: 500 });
  }
}
