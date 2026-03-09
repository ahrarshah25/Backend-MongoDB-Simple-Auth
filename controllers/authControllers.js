import userModels from "../models/userModels.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModels.findOne({ email: email });

    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "user already registered.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModels({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in registeration user",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: true,
        message: "email not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: true,
        message: "invalid password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = await JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while logging",
      error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).send({
      success: true,
      message: "Logout Successfully",
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while logout",
      error
    })
  }
}

export { signupController, loginController, logoutController };