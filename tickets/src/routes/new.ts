import { Router, Request, Response, response } from "express";

const router = Router();

router.post("/api/tickets", async () => {
  return response.status(200).json({});
});

export { router as newTicketRouter };
