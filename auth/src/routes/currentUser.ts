import { Router, Response, Request } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/api/users/me", (req: Request, res: Response) => {
  if (!req.session?.jwt) {
    return res.status(401).json({ data: null });
  }

  try {
    const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!);

    return res.status(200).json({ data: payload });
  } catch (err) {
    return res.status(401).json({ data: null });
  }
});

export { router as currentUserRouter };
