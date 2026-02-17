import { desc, eq } from "drizzle-orm";

import { listings, reservations, users } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser";

export async function getRservations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const rows = await db
    .select({
      reservation: reservations,
      listing: listings,
      user: users,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .innerJoin(users, eq(reservations.userId, users.id))
    .where(eq(listings.userId, currentUser.id))
    .orderBy(desc(reservations.createdAt));

  return rows.map((row) => ({
    ...row.reservation,
    listing: row.listing,
    user: row.user,
    startDate: row.reservation.startDate.toISOString(),
    endDate: row.reservation.endDate.toISOString(),
    createdAt: row.reservation.createdAt.toISOString(),
  }));
}
