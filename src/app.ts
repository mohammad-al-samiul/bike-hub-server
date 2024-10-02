import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { paymentRouter } from "./app/modules/payment/payment.route";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bikehub-client.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", router);
app.use("/api/payment", paymentRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
