import ReservationPage from '@/components/reservations/ReservationPage'
import ListingCardSkeleton from '@/components/skeletons/ListingCardSkeleton'
import { Suspense } from 'react'


export default function Page() {
  return (
    <Suspense fallback={ <ListingCardSkeleton/> }>
      <ReservationPage/>
    </Suspense>
  )
}
