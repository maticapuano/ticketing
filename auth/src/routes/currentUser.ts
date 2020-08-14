import { Router, Response, Request } from "express";
import { currentUser } from "../middlewares/current-user";

const router = Router();

router.get("/api/users/me", currentUser, (req: Request, res: Response) => {
  return res.status(200).json({ data: req.currentUser || null });
});

export { router as currentUserRouter };
