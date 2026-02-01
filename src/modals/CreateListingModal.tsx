"use client";

import axios from "axios"
import { useCreateListingModal } from "@/store/useCreateListingModal";
import Modal from "./Modal";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { categories } from "@/constants/Categories";
import CategoryCard from "@/components/listings/CategoryCard";
import CountrySelect from "@/components/listings/CountrySelect";
import { Country } from "@/custom-hooks/useCountries";
import dynamic from "next/dynamic";
import Counter from "@/components/listings/Counter";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/listings/ImageUpload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  COUNTERS: 2,
  DETAILS: 3,
  IMAGES: 4,
  PRICE: 5,
};

export default function CreateListingModal() {
  const { isOpen, close } = useCreateListingModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [location, setLocation] = useState<null | Country>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<null | File>(null);
  const [preview, setPreview] = useState<null | string>(null);
  const [price, setPrice] = useState("");
  const [loading,setLoading] = useState(false);

  const router = useRouter();

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
        return "Which of these best describes your place?";
      case STEPS.LOCATION:
        return "Where is your place located?";
      case STEPS.COUNTERS:
        return "Share some basics about your place";
      case STEPS.DETAILS:
        return "How would you describe your place?";
      case STEPS.IMAGES:
        return "Add photos of your place";
      case STEPS.PRICE:
        return "How much do you charge per night?";
      default:
        return "";
    }
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const createListing = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !location?.value ||
      !category ||
      !image
    ) {
      toast("All fields are required!", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      
      formData.append("title",title);
      formData.append("description",description);
      formData.append("price",price);
      formData.append("locationValue",location.value);
      formData.append("category",category);
      formData.append("roomCount",roomCount.toString());
      formData.append("bathroomCount",bathroomCount.toString());
      formData.append("guestCount",guestCount.toString());
      formData.append("image",image);

      await axios.post("/api/listings",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

       toast("Listing created successfully", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });  

      handleClose();
      router.replace("/properties");

    } catch (error) {
      if(axios.isAxiosError(error)){
         toast(error.response?.data.error || "Something went wrong", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });        
      }            
    } finally {
      setLoading(false)
    }
  };

  const handleClose = () => {
    setCategory("")
    setPrice("");
    setRoomCount(1);
    setBathroomCount(1);
    setGuestCount(1);
    setLocation(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setStep(STEPS.CATEGORY);
    close();
  }
  return (
    <Modal isOpen={isOpen} onClose={close} title="Create a new listing">
      {/* step indicator */}
      <div className="mb-7 flex items-center justify-between text-sm text-gray-500">
        <span>Step {step + 1} of 6</span>
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

        {step === STEPS.COUNTERS && (
          <div className="space-y-2">
            <Counter
              title="Guests"
              subtitle="How many guests can stay?"
              value={guestCount}
              onChange={setGuestCount}
            />
            <Counter
              title="Rooms"
              subtitle="How many rooms are available?"
              value={roomCount}
              onChange={setRoomCount}
            />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms?"
              value={bathroomCount}
              onChange={setBathroomCount}
            />
          </div>
        )}

        {step === STEPS.DETAILS && (
          <div className="space-y-10 w-full text-gray">
            <Input
              name="title"
              label="Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
            />
            <Input
              as="textarea"
              name="description"
              label="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDescription(e.target.value);
              }}
            />
            <p className="text-xs text-gray-400">Short titles work best</p>
          </div>
        )}

        {step === STEPS.IMAGES && (
          <ImageUpload onChange={handleImageChange} preview={preview} />
        )}

        {step === STEPS.PRICE && (
          <Input
            min={10}
            type="number"
            name="price"
            label="Price($)"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPrice(e.target.value);
            }}
          />
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
        loading={loading}
        disabled={loading}
          onClick={() =>
            step < STEPS.PRICE ? setStep((prev) => prev + 1) : createListing()
          }
        >
          {step === STEPS.PRICE ? "Create listing" : "Next"}
        </Button>
      </div>
    </Modal>
  );
}
