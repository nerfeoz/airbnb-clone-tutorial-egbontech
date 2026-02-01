import FavoritesPage from "@/components/favorites/FavoritesPage";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={ <ListingCardSkeleton/> }>
      <FavoritesPage/>
    </Suspense>
  )
}
