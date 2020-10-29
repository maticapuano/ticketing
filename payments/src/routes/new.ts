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
import { Order } from "../models/order";

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

    res.status(201).json({
      success: true,
    });
  }
);

export { router as indexPaymentRouter };
