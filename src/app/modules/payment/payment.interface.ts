export type TPaymentProps = {
  clientName: string | undefined;
  address: string | null | undefined;
  clientPhoneNo: number | null | undefined;
  transactionId: string;
  clientEmail: string | undefined;
  bikeName: string;
  bikeId: string;
  totalCost: number;
  startTime: string;
  returnTime: string;

  _id?: string;
};

export type TPaymentInfo = {
  transactionId: string;
};
