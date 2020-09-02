import { Router, Response, Request } from "express";
import { Ticket } from "../models/Ticket";
import { NotFoundError } from "@mcticketing/common";

const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }
  return res.status(200).json({
    data: ticket,
  });
});

export { router as showTicketsRouter };
