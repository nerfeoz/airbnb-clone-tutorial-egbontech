import { User } from "./user";

export interface Listing{
      id: string;
  title: string;
  description: string;
  imageSrc: string;
  category:string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  price: number;
  locationValue: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  user?: User; // 
}