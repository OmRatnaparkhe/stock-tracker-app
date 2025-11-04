"use client";
import React, { useMemo, useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/client/watchlist";

// Minimal WatchlistButton implementation to satisfy page requirements.
// This component focuses on UI contract only. It toggles local state and
// calls onWatchlistChange if provided. Styling hooks match globals.css.

const WatchlistButton = ({
                             symbol,
                             company,
                             isInWatchlist,
                             showTrashIcon = false,
                             type = "button",
                             onWatchlistChange,
                         }: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);
    const [pending, setPending] = useState<boolean>(false);

    const label = useMemo(() => {
        if (type === "icon") return added ? "" : "";
        return added ? "Remove from Watchlist" : "Add to Watchlist";
    }, [added, type]);

    const handleClick = async () => {
        if (pending) return;
        const next = !added;
        // optimistic update
        setAdded(next);
        onWatchlistChange?.(symbol, next);
        try {
            setPending(true);
            if (next) {
                await addToWatchlist(symbol, company);
            } else {
                await removeFromWatchlist(symbol);
            }
        } catch (e) {
            // revert on failure
            setAdded(!next);
            onWatchlistChange?.(symbol, !next);
            // no extra UI dependencies; swallow error
            console.error("Watchlist toggle failed", e);
        } finally {
            setPending(false);
        }
    };

    if (type === "icon") {
        return (
            <button
                title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            className={`watchlist-btn ${added ? "watchlist-remove" : ""} inline-flex items-center justify-center gap-2 px-4 py-2`}
            onClick={handleClick}
            disabled={pending}
        >
            <span className="leading-none">{label}</span>
        </button>
    );
};

export default WatchlistButton;