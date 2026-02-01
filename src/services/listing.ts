import axios from "axios";

export type GetListingsParams = {
  category?: string;
  locationValue?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function getListings(params?: GetListingsParams) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/listings`,
      {
        params: {
          category: params?.category,
          locationValue: params?.locationValue,
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
        },
      },
    );

    return data;
  } catch {
    throw new Error("Failed to fetch listings");
  }
}
