import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/orders/:id", async (req: Request, res: Response) => {
  res.status(200).json({
    message: `The service the orders Working method GET ${req.params.id} 😁😁😜😍`,
  });
});

export { router as showOrderRouter };
