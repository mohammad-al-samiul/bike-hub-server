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
    return `

     <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet" />
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" />
    <title>Payment Confirmation</title>
    <style>
      ._success {
        box-shadow: 0 15px 25px #00000019;
        padding: 45px;
        width: 100%;
        text-align: center;
        margin: 40px auto;
        border-bottom: solid 4px #28a745;
      }

      ._success i {
        font-size: 55px;
        color: #28a745;
      }

      ._success h2 {
        margin-bottom: 12px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 10px;
      }

      ._success p {
        margin-bottom: 0px;
        font-size: 18px;
        color: #495057;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="message-box _success">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
            <h2>Your payment was successful</h2>
            <p>
              Thank you for your payment. we will <br />
              be in contact with more details shortly
            </p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </body>
</html>

    
    `;
  } else if (status === "failed") {
    return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet" />
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" />
    <title>Payment Confirmation</title>
    <style>
    ._failed{ border-bottom: solid 4px red !important; }
    ._failed i{  color:red !important;  }

      ._success {
        box-shadow: 0 15px 25px #00000019;
        padding: 45px;
        width: 100%;
        text-align: center;
        margin: 40px auto;
        border-bottom: solid 4px #28a745;
      }

      ._success i {
        font-size: 55px;
        color: #28a745;
      }

      ._success h2 {
        margin-bottom: 12px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 10px;
      }

      ._success p {
        margin-bottom: 0px;
        font-size: 18px;
        color: #495057;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="message-box _success _failed">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <h2>Your payment failed</h2>
            <p>Try again later</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

    
    `;
  }
};

export const paymentServices = {
  confirmationServiceIntoDB,
};
