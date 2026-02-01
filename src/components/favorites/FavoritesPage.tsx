import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getFavoriteListings } from "@/server-actions/getFavoriteListings";
import EmptyListings from "../ui/EmptyListings";
import ListingCard from "../listings/ListingCard";

export default async function FavoritesPage() {
  const currentUser = await getCurrentUser();
  const listings = await getFavoriteListings();

  if (listings.length === 0) {
   return (
     <EmptyListings
      title="No favorites yet"
      subtitle="Start exploring and save your favorite places"
    />
   )
  }
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Favorite Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => {
          return (
            <ListingCard
              listing={listing}
              currentUser={currentUser}
              key={listing.id}
            />
          );
        })}
      </div>
    </div>
  );
}
