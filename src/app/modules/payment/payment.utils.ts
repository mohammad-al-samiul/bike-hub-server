import axios from "axios";
import config from "../../config";
import { TPaymentProps } from "./payment.interface";

export const initiatePayment = async (paymentData: TPaymentProps) => {
  try {
    const response = await axios.post(config.payment_url as string, {
      store_id: config.amarpay_store_id,
      signature_key: config.amarpay_signature_key,
      tran_id: paymentData.transactionId,
      success_url: `${config.backend_url}/api/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `${config.backend_url}/api/confirmation?status=failed`,
      cancel_url: `${config.frontend_url}/user/my-rentals`,
      amount: paymentData.totalCost,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentData?.clientName,
      cus_email: paymentData?.clientEmail,
      cus_add1: paymentData?.address,
      cus_add2: "Mohakhali DOHS",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1206",
      cus_country: "Bangladesh",
      cus_phone: paymentData?.clientPhoneNo, // This seems incorrect, make sure the phone number is dynamic
      type: "json",
    });
    return response.data;
  } catch (error) {
    throw new Error("Payment initiation failed");
  }
};
export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.amarpay_store_id,
        signature_key: config.amarpay_signature_key,
        type: "json",
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error("Payment validation failed");
  }
};
