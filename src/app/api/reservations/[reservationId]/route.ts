import prisma from "@/lib/prisma";
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

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      listing: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 },
    );
  }

  //check for ownership
  const isGuest = reservation.userId === currentUser.id;
  const isHost = reservation.listing.userId === currentUser.id;

  if (!isGuest && !isHost) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.reservation.delete({
    where: { id: reservationId },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
