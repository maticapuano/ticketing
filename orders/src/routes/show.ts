import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@mcticketing/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

const router = Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    return res.status(200).json({
      data: order,
    });
  }
);

export { router as showOrderRouter };
