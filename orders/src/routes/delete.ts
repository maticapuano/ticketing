import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@mcticketing/common";
import { Request, Response, Router } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    //Update status order to Canceled

    order.status = OrderStatus.Canceled;

    await order.save();

    //Emit a event after mark as Canceled a Order.

    new OrderCancelledPublisher(natsWrapper.getClient).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    return res.status(202).json({
      data: order,
    });
  }
);

export { router as deleteOrderRouter };
