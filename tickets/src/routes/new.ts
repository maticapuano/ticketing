import { Router, Request, Response } from "express";
import { requireAuth } from "@mcticketing/common";
const router = Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  return res.status(200).json({});
});

export { router as newTicketRouter };
