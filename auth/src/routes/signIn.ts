import { Router, Response, Request } from "express";

const router = Router();

router.post("/api/users/signin", (req: Request, res: Response) => {
  res.end("Hi there!!");
});

export { router as signInRouter };
