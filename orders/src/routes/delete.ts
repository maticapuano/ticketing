import { Request, Response, Router } from "express";

const router = Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "The service the orders Working method DELETE 😁😁😜😍",
  });
});

export { router as deleteOrderRouter };
