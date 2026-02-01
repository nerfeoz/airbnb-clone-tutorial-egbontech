import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getProperties() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  const listings = await prisma.listing.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings;
}
