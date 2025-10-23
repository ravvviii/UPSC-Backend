import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const sanitize = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  subscriptionStatus: user.subscriptionStatus,
  referralCode: user.referralCode,
  streak: user.streak,
  points: user.points,
});

export const register = async (req, res, next) => {
  try {
    const { username, email, password, referralCode } = req.body;
    if (!username || !email || !password)
      return next({ status: 400, message: "Missing required fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return next({ status: 409, message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
      subscriptionStatus: "trial",
      trialStartDate: new Date(),
      referralCode: nanoid(8),
      referredBy: referralCode || undefined
    });

    const token = signToken({ id: user._id, username: user.username });
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password)
      return next({ status: 400, message: "Missing credentials" });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) return next({ status: 401, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next({ status: 401, message: "Invalid credentials" });

    const token = signToken({ id: user._id, username: user.username });
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};
