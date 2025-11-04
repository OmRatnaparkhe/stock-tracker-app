import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { symbol: rawSymbol } = await params;
    const symbol = String(rawSymbol || "").trim().toUpperCase();
    if (!symbol) return NextResponse.json({ success: false, message: "symbol is required" }, { status: 400 });

    await connectToDatabase();

    const res = await Watchlist.deleteOne({ userId: session.user.id, symbol });
    const removed = res.deletedCount && res.deletedCount > 0;

    return NextResponse.json({ success: true, removed });
  } catch (e) {
    console.error("Watchlist DELETE error", e);
    return NextResponse.json({ success: false, message: "Failed to remove from watchlist" }, { status: 500 });
  }
}
