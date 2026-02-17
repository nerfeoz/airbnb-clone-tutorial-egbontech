import { desc, eq } from "drizzle-orm";

import { listings } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser";

export async function getProperties() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const userListings = await db.query.listings.findMany({
    where: eq(listings.userId, currentUser.id),
    orderBy: [desc(listings.createdAt)],
  });

  return userListings;
}
