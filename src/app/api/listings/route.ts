import { and, desc, eq, gte, lte } from "drizzle-orm";

import { listings } from "@/db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import {
  CloudinaryUploadResult,
  uploadToCloudinary,
} from "@/services/cloudinary";
import { NextResponse } from "next/server";
import cuid from "cuid";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const guestCount = formData.get("guestCount") as string;
    const bathroomCount = formData.get("bathroomCount") as string;
    const roomCount = formData.get("roomCount") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const locationValue = formData.get("locationValue") as string;
    const image = formData.get("image") as File;

    if (
      !title ||
      !description ||
      !price ||
      !locationValue ||
      !category ||
      !image
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    //upload the image to cloudinary
    const imageData: CloudinaryUploadResult = await uploadToCloudinary(image);

    const [listing] = await db
      .insert(listings)
      .values({
        id: cuid(),
        title,
        description,
        price: Number(price),
        locationValue,
        category,
        imageSrc: imageData.secure_url,
        userId: currentUser.id,
        roomCount: Number(roomCount),
        guestCount: Number(guestCount),
        bathroomCount: Number(bathroomCount),
      })
      .returning();

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("[LISTINGS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const locationValue = searchParams.get("locationValue");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const conditions = [];

    if (category) conditions.push(eq(listings.category, category));
    if (locationValue)
      conditions.push(eq(listings.locationValue, locationValue));
    if (minPrice) conditions.push(gte(listings.price, Number(minPrice)));
    if (maxPrice) conditions.push(lte(listings.price, Number(maxPrice)));

    const query = db.select().from(listings);

    const listingsResult =
      conditions.length > 0
        ? query.where(and(...conditions)).orderBy(desc(listings.createdAt))
        : query.orderBy(desc(listings.createdAt));

    return NextResponse.json(await listingsResult);
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
