import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, nationality, dateOfBirth } =
      req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !nationality ||
      !dateOfBirth
    ) {
      return res
        .status(400)
        .json({ message: "Enter the valid credentials..." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email is already registered..." });
    }

    const salt = await bcrypt.genSalt(12);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPassword,
      profile: {
        firstName,
        lastName,
        nationality,
        dateOfBirth,
      },
    });

    await newUser.save();

    res.status(201).json({ message: "User register successful..." });
  } catch (error) {
    res.status(500).json({ message: "Server error...", error });
  }
};
