import { Types } from "mongoose";

export type TRental = {
  userEmail: string;
  bikeId: Types.ObjectId;
  startTime: string;
  returnTime: string;
  totalCost: number;
  isReturned: boolean;
};
