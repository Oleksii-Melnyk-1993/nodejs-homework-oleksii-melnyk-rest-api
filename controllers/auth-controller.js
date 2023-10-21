import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import sharp from "sharp";
import jimp from "jimp";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password, subscription } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw HttpError(
      409,
      `${email} is already used!
`
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mn" });

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription,
    avatarURL,
  });
  const payload = { userId: newUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  res.status(201).json({
    token,
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true }
  );

  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.json({ email: user.email, subscription: user.subscription });
};

const updateAvatar = async (req, res, next) => {
  const { file } = req;
  const { _id } = req.user;

  const formatJimp = (format) => {
    const formats = ["jpeg", "jpg", "png", "bmp", "tiff", "gif"];
    return formats.includes(format);
  };

  const fileExtention = path.extname(file.originalname).slice(1);
  let originalPath = null;

  if (!formatJimp(fileExtention)) {
    originalPath = file.path;
    const convertedPath = `${file.path}.png`;
    await sharp(file.path).toFile(convertedPath);
    file.path = convertedPath;
  }

  const image = await jimp.read(file.path);
  await image.resize(250, 250).writeAsync(file.path);

  const fileName = `${_id}${path.extname(file.path)}`;
  const newPath = path.join("public", "avatars", fileName);

  await fs.rename(file.path, newPath);

  if (originalPath) {
    await fs.unlink(originalPath);
  }

  const avatarURL = `/avatars/${fileName}`;
  await User.findByIdAndUpdate(_id, { avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
