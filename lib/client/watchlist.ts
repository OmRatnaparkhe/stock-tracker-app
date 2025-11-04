export async function addToWatchlist(symbol: string, company: string) {
  const res = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, company }),
  });
  if (!res.ok) throw new Error("Failed to add to watchlist");
  return res.json();
}

export async function removeFromWatchlist(symbol: string) {
  const res = await fetch(`/api/watchlist/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from watchlist");
  return res.json();
}

export async function getWatchlist() {
  const res = await fetch("/api/watchlist", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
}
