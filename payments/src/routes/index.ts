import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/payment", (req: Request, res: Response) => {
  return res.json({
    service: "payments",
    work: true,
  });
});

export { router as indexPaymentRouter };
