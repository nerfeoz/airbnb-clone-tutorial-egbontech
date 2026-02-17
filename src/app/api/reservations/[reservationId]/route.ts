import { eq } from "drizzle-orm";

import { listings, reservations } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ reservationId: string }> },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reservationId } = await params;

  if (!reservationId) {
    return NextResponse.json(
      { error: "Missing reservationId" },
      { status: 400 },
    );
  }

  const rows = await db
    .select({
      reservation: reservations,
      listing: listings,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .where(eq(reservations.id, reservationId))
    .limit(1);

  const reservation = rows[0];

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 },
    );
  }

  //check for ownership
  const isGuest = reservation.reservation.userId === currentUser.id;
  const isHost = reservation.listing.userId === currentUser.id;

  if (!isGuest && !isHost) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await db.delete(reservations).where(eq(reservations.id, reservationId));

  return NextResponse.json({ success: true }, { status: 200 });
}
