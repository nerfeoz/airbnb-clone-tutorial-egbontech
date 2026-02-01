"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface useFavoriteProps {
  listingId: string;
  currentUser?: {
    id: string;
    favoriteIds: string[];
  } | null;
}

export function useFavorite({ currentUser, listingId }: useFavoriteProps) {
  const hasFavorited = currentUser?.favoriteIds.includes(listingId);

  const router = useRouter();

  const toggleFavorite = async () => {
    if (!currentUser) {
      toast("Please login to favorite listings", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
      return;
    }

    try {
      if (hasFavorited) {
        await axios.delete(`/api/favorites/${listingId}`);
      } else {
        await axios.post(`/api/favorites/${listingId}`);
      }

      router.refresh();
    } catch  {
      toast.error("Something went wrong");
    }
  };

  return { hasFavorited, toggleFavorite };
}
