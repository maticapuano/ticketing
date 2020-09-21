import { Request, Response, Router } from "express";

const router = Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "The service the orders Working method post 😁😁😜😍",
  });
});

export { router as newOrderRouter };
