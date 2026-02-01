"use client";

import { useFavorite } from "@/custom-hooks/useFavorite";
import clsx from "clsx";
import { LuHeart } from "react-icons/lu";

interface HeartButtonProps {
  listingId: string;
  currentUser?: {
    id: string;
    favoriteIds: string[];
  } | null;
}

export default function HeartButton({
  listingId,
  currentUser,
}: HeartButtonProps) {
  const { toggleFavorite, hasFavorited } = useFavorite({
    listingId,
    currentUser,
  });
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow cursor-pointer"
    >
      <LuHeart
        size={18}
        className={clsx(
          "transition",
          hasFavorited ? "fill-rose-500 text-rose-500" : "text-gray-700",
        )}
      />
    </button>
  );
}
