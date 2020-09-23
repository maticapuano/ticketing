import { Request, Response, Router } from "express";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@mcticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";

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

    res.status(200).json({
      message: "The service the orders Working method post 😁😁😜😍",
    });
  }
);

export { router as newOrderRouter };
