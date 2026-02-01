import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getFavoriteListings() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      favoriteIds: true,
    },
  });

  if (!user || user.favoriteIds.length === 0) {
    return [];
  }

  //fetch the listings in the user favorite Ids
  const listings = await prisma.listing.findMany({
    where: {
      id: {
        in: user.favoriteIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings;
}
