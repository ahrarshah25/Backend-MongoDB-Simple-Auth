import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import checkAuth from "../utils/checkAuth.js";

dotenv.config();

const authCheckMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(404).send({
        success: false,
        message: "User not logged in",
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    await checkAuth(req.user._id);

    next();

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Invalid Token Request",
      error,
    });
  }
};

export default authCheckMiddleware;