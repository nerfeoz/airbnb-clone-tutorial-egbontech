import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getRservations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      listing: {
        userId: currentUser.id,
      },
    },
    include: {
      listing: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reservations.map((reservation) => ({
    ...reservation,
    startDate: reservation.startDate.toISOString(),
    endDate: reservation.endDate.toISOString(),
    createdAt: reservation.createdAt.toISOString,
  }));
}
