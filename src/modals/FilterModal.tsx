"use client";

import { useFilterModal } from "@/store/useFilterListingModal";
import Modal from "./Modal";
import { Suspense, useState } from "react";
import useCountries, { Country } from "@/custom-hooks/useCountries";
import Button from "@/components/ui/Button";
import { categories } from "@/constants/Categories";
import CategoryCard from "@/components/listings/CategoryCard";
import CountrySelect from "@/components/listings/CountrySelect";
import dynamic from "next/dynamic";
import Input from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  PRICE: 2,
};

function FilterModalComponent() {
  const { getByValue } = useCountries();
  const searchParams = useSearchParams();
  const { isOpen, close } = useFilterModal();
  const [step, setStep] = useState(STEPS.CATEGORY);

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const router = useRouter();

  const getLocationFromParams = () => {
    const value = searchParams.get("locationValue");
    if (!value) return null;
    return getByValue(value) ?? null;
  };

  const [location, setLocation] = useState<null | Country>(
    getLocationFromParams(),
  );

  const MapComponent = dynamic(
    () => import("../components/general/map/MapComponent"),
    {
      ssr: false,
      loading: () => <p className="text-center py-6">Loading map...</p>,
    },
  );

  const stepTitle = () => {
    switch (step) {
      case STEPS.CATEGORY:
        return "Select a category";
      case STEPS.LOCATION:
        return "Select a location";
      case STEPS.PRICE:
        return "Select a price range";
      default:
        return "";
    }
  };

  const onApplyFilters = () => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (location) params.set("locationValue", location.value);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/?${params.toString()}`);
    setStep(STEPS.CATEGORY);
    close();
  };

  const disableFilterButton =
    !category && !location && !minPrice && !maxPrice && step === STEPS.PRICE;
  return (
    <Modal title="Filter Listings" isOpen={isOpen} onClose={close}>
      {/* step indicator */}
      <div className="mb-7 flex items-center justify-between text-sm text-gray-500">
        <span>Step {step + 1} of 3</span>
        <span className="font-medium text-gray-700">{stepTitle()}</span>
      </div>
      <div className="min-h-55 flex items-center justify-center rounded-xl text-gray-400 px-6">
        {step === STEPS.CATEGORY && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {categories.map((item) => {
              return (
                <CategoryCard
                  label={item.label}
                  icon={item.icon}
                  key={item.slug}
                  onClick={() => setCategory(item.slug)}
                  selected={category === item.slug}
                />
              );
            })}
          </div>
        )}

        {step === STEPS.LOCATION && (
          <div className="w-full space-y-2 py-6">
            <CountrySelect
              value={location}
              onChange={(value) => setLocation(value)}
            />

            <div className="h-80 overflow-hidden border">
              <MapComponent center={location?.latlng || [51.505, -0.09]} />
            </div>
          </div>
        )}

        {step == STEPS.PRICE && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Min Price"
                name="min-price"
                type="number"
                value={minPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMinPrice(e.target.value);
                }}
              />
            </div>
            <div>
              <Input
                label="Max Price"
                name="max-price"
                type="number"
                value={maxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMaxPrice(e.target.value);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="mt-8 flex gap-3">
        {step > STEPS.CATEGORY && (
          <Button onClick={() => setStep((prev) => prev - 1)} variant="outline">
            Back
          </Button>
        )}

        <Button
          disabled={disableFilterButton}
          onClick={() =>
            step < STEPS.PRICE ? setStep((prev) => prev + 1) : onApplyFilters()
          }
        >
          {step === STEPS.PRICE ? "Apply Filter" : "Next"}
        </Button>
      </div>
    </Modal>
  );
}

export default function FilterModal() {
  return (
    <Suspense>
      <FilterModalComponent />
    </Suspense>
  );
}
