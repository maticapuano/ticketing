import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@mcticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";

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
    res.status(200).json({
      message: "The service the orders Working method post 😁😁😜😍",
    });
  }
);

export { router as newOrderRouter };
