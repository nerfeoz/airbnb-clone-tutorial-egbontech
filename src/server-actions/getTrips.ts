import { desc, eq } from "drizzle-orm";

import { listings, reservations } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser";

export async function getTrips() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const rows = await db
    .select({
      reservation: reservations,
      listing: listings,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .where(eq(reservations.userId, currentUser.id))
    .orderBy(desc(reservations.startDate));

  return rows.map((row) => ({
    ...row.reservation,
    startDate: row.reservation.startDate.toISOString(),
    endDate: row.reservation.endDate.toISOString(),
    createdAt: row.reservation.createdAt.toISOString(),
    listing: {
      ...row.listing,
      createdAt: row.listing.createdAt.toISOString(),
    },
  }));
}
