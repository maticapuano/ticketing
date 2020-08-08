import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error("Invalid email or password");
    }

    const { email, password } = req.body;

    console.log("Creating user...");
    console.log(email, "Email");
    console.log(password, "Password");

    res.json({});
  }
);

export { router as signUpRouter };
