import ListingCard from "./ListingCard";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getListings } from "@/services/listing";
import { Listing } from "@/generated/prisma/client";
import EmptyListings from "../ui/EmptyListings";

interface HomeProps {
  searchParams: {
    category?: string;
    locationValue?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export default async function Listings({ searchParams }: HomeProps) {
  const params = searchParams;
  const currentUser = await getCurrentUser();
  const listings = await getListings({
    category: params.category,
    locationValue: params.locationValue,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
  });
  
  if(listings.length === 0){
     return (
         <EmptyListings
          title="No listings found"
          subtitle="We couldn’t find any listings that match your filters.
        Try adjusting or clearing some filters to see more results."
        filter
        />
       )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {listings.map((listing:Listing) => {
        return <ListingCard key={listing.id} listing={listing} currentUser={currentUser} />;
      })}
    </div>
  );
}
