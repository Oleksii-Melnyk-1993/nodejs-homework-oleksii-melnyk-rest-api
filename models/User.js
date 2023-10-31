import { Schema, model } from "mongoose";
import { handleSaveError } from "../helpers/handleSaveError.js";
import Joi from "joi";

const emailRegenxp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/;
const userSchema = new Schema(
  {
    password: { type: String, minlength: 6, required: true },

    email: {
      type: String,
      match: emailRegenxp,
      unique: true,
      required: [true, "Email is required"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

export const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegenxp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegenxp).required(),
  password: Joi.string().min(6).required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegenxp).required(),
});

const User = model("user", userSchema);

export default User;
