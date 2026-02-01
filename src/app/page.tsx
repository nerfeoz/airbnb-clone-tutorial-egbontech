import Listings from "@/components/listings/Listings";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import { Suspense } from "react";


type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  return (
    <Suspense fallback={ <ListingCardSkeleton/> }>
      <Listings searchParams={searchParams} />
    </Suspense>
  );
}
