import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { validateRequest, BadRequestError } from "@mcticketing/common";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email")
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exitingUser = await User.findOne({ email });

    if (exitingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });

    await user.save();

    const userToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userToken,
    };

    return res.status(201).send({ data: user, token: userToken });
  }
);

export { router as signUpRouter };
