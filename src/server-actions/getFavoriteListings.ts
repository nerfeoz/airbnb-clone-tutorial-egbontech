import { desc, eq, inArray } from "drizzle-orm";

import { listings, users } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser";

export async function getFavoriteListings() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, currentUser.id),
    columns: {
      favoriteIds: true,
    },
  });

  if (!user || user.favoriteIds.length === 0) {
    return [];
  }

  //fetch the listings in the user favorite Ids
  const favoriteListings = await db
    .select()
    .from(listings)
    .where(inArray(listings.id, user.favoriteIds))
    .orderBy(desc(listings.createdAt));

  return favoriteListings;
}
