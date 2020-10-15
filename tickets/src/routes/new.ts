import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@mcticketing/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is requerid"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id: userId } = req.currentUser!;

    const ticket = Ticket.build({ title, price, userId });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.getClient).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(201).json({
      data: ticket,
    });
  }
);

export { router as newTicketRouter };
