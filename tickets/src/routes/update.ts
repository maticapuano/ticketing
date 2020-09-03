import { Router, Response, Request } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotAuthorizedError,
  requireAuth,
  NotFoundError,
} from "@mcticketing/common";
import { Ticket } from "../models/Ticket";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is requerid"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provider and must be grater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
  }
);

export { router as updateTicketRouter };
