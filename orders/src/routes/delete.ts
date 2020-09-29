import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@mcticketing/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

const router = Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    //Update status order to Canceled

    order.status = OrderStatus.Canceled;

    await order.save();

    return res.status(202).json({
      data: order,
    });
  }
);

export { router as deleteOrderRouter };
