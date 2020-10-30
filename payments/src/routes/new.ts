import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mcticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const findPayment = await Payment.findOne({
      orderId: order.id,
    });

    if (findPayment) {
      throw new BadRequestError("Cannot pay for an payed order.");
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "USD",
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    //Emit event payment created successful
    await new PaymentCreatedPublisher(natsWrapper.getClient).publish({
      id: payment.id,
      orderId: order.id,
      stripeId: payment.id,
    });

    return res.status(204).json({ success: true });
  }
);

export { router as indexPaymentRouter };
