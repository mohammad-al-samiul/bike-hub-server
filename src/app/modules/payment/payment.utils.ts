/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import config from "../../config";

export const initiatePayment = async (paymentData: any) => {
  const response = await axios.post(config.payment_url as string, {
    store_id: config.amarpay_store_id,
    signature_key: config.amarpay_signature_key,
    tran_id: paymentData.transactionId,
    success_url: `http://localhost:5000/api/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
    fail_url: `http://localhost:5000/api/payment/confirmation?status=failed`,
    cancel_url: `http://localhost:5173/user/my-rentals`,
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
    cus_phone: "+8801704",
    type: "json",
  });
  return response.data;
};

export const verifyPayment = async (tnxId: string) => {
  const response = await axios.get(config.payment_verify_url!, {
    params: {
      store_id: config.amarpay_store_id,
      signature_key: config.amarpay_signature_key,
      type: "json",
      request_id: tnxId,
    },
  });
  return response.data;
};
