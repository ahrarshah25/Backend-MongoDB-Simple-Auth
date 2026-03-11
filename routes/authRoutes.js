import express from "express";
import {
  loginController,
  signupController,
  logoutController,
} from "../controllers/authControllers.js";
import authCheckMiddleware from "../middlewares/authMiddleware.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupController);
router.get("/logout", logoutController);

router.get("/check-auth", authCheckMiddleware, async (req, res) => {

  const user = await checkAuth(req.user._id);

  res.status(200).send({
    success: true,
    message: "User authenticated",
    user: user,
  });

});

export default router;