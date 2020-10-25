import { Request, Response, Router } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mcticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provider."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.body.ticketId;

    //Find the ticket the user is trying the order in the database.
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    //Build the order and save it to the database.
    const order = Order.build({
      userId: req.currentUser!.id,
      ticket: ticketId,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });

    await order.save();

    //Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.getClient).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
    });

    res.status(201).json({
      order,
    });
  }
);

export { router as newOrderRouter };
