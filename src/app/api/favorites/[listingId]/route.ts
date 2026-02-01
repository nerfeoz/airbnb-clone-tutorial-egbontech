import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ listingId: string }> },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await params;

    if (!listingId) {
      return NextResponse.json(
        { error: "Invalid listing id" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        favoriteIds: {
          push: listingId,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[FAVORITE_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ listingId: string }> },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await params;

    if (!listingId) {
      return NextResponse.json(
        { error: "Invalid listing id" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedFavoriteIds = user.favoriteIds.filter(
      (id: string) => id !== listingId,
    );

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        favoriteIds: updatedFavoriteIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[FAVORITE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
