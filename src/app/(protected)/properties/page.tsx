import PropertiesPage from '@/components/properties/PropertiesPage'
import ListingCardSkeleton from '@/components/skeletons/ListingCardSkeleton'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={ <ListingCardSkeleton/> }>
      <PropertiesPage/>
    </Suspense>
  )
}
