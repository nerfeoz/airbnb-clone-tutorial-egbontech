import { getProperties } from "@/server-actions/getProperties"
import EmptyListings from "../ui/EmptyListings";
import ListingCard from "../listings/ListingCard";


export default async function PropertiesPage() {
    const listings = await getProperties();

     if (listings.length === 0) {
       return (
         <EmptyListings
          title="No properties found"
          subtitle="You haven't listed any properties yet."
        />
       )
      }
  return (
     <div className="max-w-7xl mx-auto p-4">
          <h2 className="text-2xl font-semibold mb-6">Your Properties</h2>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => {
              return (
                <ListingCard
                  listing={listing}                  
                  key={listing.id}
                  hideFavoriteButton
                  property
                />
              );
            })}
          </div>
        </div>
  )
}
