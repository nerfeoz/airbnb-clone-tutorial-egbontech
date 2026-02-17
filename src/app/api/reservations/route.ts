import { and, eq, gte, lte } from "drizzle-orm";

import { listings, reservations } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import cuid from "cuid";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, listingId),
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId === currentUser.id) {
      return NextResponse.json(
        { error: "You cannot book your own listing" },
        { status: 403 },
      );
    }

    //check for overlapping reservations
    const existingReservation = await db.query.reservations.findFirst({
      where: and(
        eq(reservations.listingId, listingId),
        lte(reservations.startDate, new Date(endDate)),
        gte(reservations.endDate, new Date(startDate)),
      ),
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "These dates are already reserved" },
        { status: 409 },
      );
    }

    //create reservation
    const [reservation] = await db
      .insert(reservations)
      .values({
        id: cuid(),
        userId: currentUser.id,
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
      })
      .returning();

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("[RESERVATIONS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 },
    );
  }
}
