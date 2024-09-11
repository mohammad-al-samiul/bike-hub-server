import { Bike } from "../bikes/bike.model";
import { Rental } from "../rental/rental.model";
import { verifyPayment } from "./payment.utils";

const confirmationServiceIntoDB = async (
  transactionId: string,
  status: string
) => {
  const verifyResponse = await verifyPayment(transactionId);

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    const rental = await Rental.findOne({ transactionId });

    // If rental is found, update its payment status and bike availability
    if (rental) {
      await Rental.findOneAndUpdate(
        { transactionId },
        { paymentStatus: "Paid" }
      );

      // Find the bike associated with the rental
      const bike = await Bike.findOne({ _id: rental.bikeId });

      if (bike) {
        // Update bike availability to 'available'
        await Bike.findOneAndUpdate(
          { _id: rental.bikeId },
          { isAvailable: false }
        );
      }
    }
  }

  if (status === "success") {
    return `<div>
     payment success
     </div>`;
  } else if (status === "failed") {
    return `
     <div>
     payment failed
     </div>
    `;
  }
};

export const paymentServices = {
  confirmationServiceIntoDB,
};
