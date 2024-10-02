export type TPaymentProps = {
  transactionId: string;
  clientName?: string;
  clientEmail?: string;
  bikeName: string;
  bikeId: string;
  totalCost: number;
  startTime: string;
  returnTime: string;
  address?: string;
  clientPhoneNo?: number;
  _id?: string;
};

export type TPaymentInfo = {
  transactionId: string;
};
