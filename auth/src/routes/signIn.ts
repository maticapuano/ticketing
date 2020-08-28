import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@mcticketing/common";

import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Password } from "../services/password";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exitingUser = await User.findOne({ email });

    if (!exitingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMath = await Password.compare(exitingUser.password, password);

    if (!passwordMath) {
      throw new BadRequestError("Invalid credentials");
    }

    const userToken = jwt.sign(
      {
        id: exitingUser.id,
        email: exitingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userToken,
    };

    return res.status(201).json({ data: exitingUser, token: userToken });
  }
);

export { router as signInRouter };
