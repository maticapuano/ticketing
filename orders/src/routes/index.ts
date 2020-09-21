import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/orders", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "The service the orders Working 😁😁😜😍",
  });
});

export { router as indexOrderRouter };
