import { eq } from "drizzle-orm";

import { listings } from "@/db/schema";
import { db } from "@/lib/db";

export async function getListing(listingId: string) {
  try {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, listingId),
      with: {
        reservations: {
          columns: {
            startDate: true,
            endDate: true,
          },
        },
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!listing) return null;

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      reservations: listing.reservations.map((reservation) => ({
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
      })),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
