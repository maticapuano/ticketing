import { Router, Response, Request } from "express";

const router = Router();

router.get("/api/users/me", (req: Request, res: Response) => {
  res.end("Hi there!!");
});

export { router as currentUserRouter };
