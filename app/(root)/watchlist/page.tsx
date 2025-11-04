import WatchlistButton from "@/components/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    // Layout middleware already redirects unauthenticated; this is a safeguard
    return null;
  }

  await connectToDatabase();
  const items = await Watchlist.find({ userId: session.user.id }).lean();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">Your Watchlist</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full text-base leading-7">
          <thead className="bg-gray-900/50 text-gray-300">
            <tr>
              <th className="text-left px-5 py-4 text-sm md:text-xl font-semibold tracking-wide">Company</th>
              <th className="text-left px-5 py-4 text-sm md:text-xl font-semibold tracking-wide">Symbol</th>
              <th className="text-left px-5 py-4 text-sm md:text-xl font-semibold tracking-wide">Added</th>
              <th className="text-left px-5 py-4 text-sm md:text-xl font-semibold tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any) => (
              <tr key={`${it.userId}-${it.symbol}`} className="border-t border-gray-800/70">
                <td className="px-5 py-4 text-gray-200">
                  <Link href={`/stocks/${it.symbol}`} className="hover:text-yellow-400 font-medium">
                    {it.company}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/stocks/${it.symbol}`} className="inline-flex items-center gap-3">
                    <Avatar className="size-9 border border-gray-800">
                      <AvatarFallback className="bg-yellow-500/10 text-yellow-400 font-semibold">
                        {String(it.symbol || "").slice(0, 3).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </td>
                <td className="px-5 py-4 text-gray-300">{new Date(it.addedAt).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <WatchlistButton
                    symbol={it.symbol}
                    company={it.company}
                    isInWatchlist={true}
                    showTrashIcon
                    type="button"
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-gray-400 text-base" colSpan={4}>
                  No items yet. Add from any stock details page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
