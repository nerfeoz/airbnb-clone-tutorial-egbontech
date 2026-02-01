import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getTrips() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const trips = await prisma.reservation.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      startDate: "desc",
    },
    include: {
      listing: true,
    },
  });

  return trips.map((trip) => ({
    ...trip,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    createdAt: trip.createdAt.toISOString(),
    listing: {
      ...trip.listing,
      createdAt: trip.listing.createdAt.toISOString(),
    },
  }));
}
