import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@mcticketing/common";
import { body } from "express-validator";

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
  (req: Request, res: Response) => {
    return res.status(201).json({});
  }
);

export { router as newTicketRouter };
