import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import TripsPage from "@/components/trips/TripsPage";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={ <ListingCardSkeleton/> }>
      <TripsPage/>
    </Suspense>
  )
}
