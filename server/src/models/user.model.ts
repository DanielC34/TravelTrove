import mongoose, { Schema, model, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

/* ---------- Types ---------- */
type Provider = "local" | "google" | "facebook";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  providers: Provider[];
  createdAt?: Date; // provided by timestamps
  updatedAt?: Date;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDocument = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, {}, IUserMethods>;

/* ---------- Schema ---------- */
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // optional: basic email pattern
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    providers: {
      type: [String],
      enum: ["local", "google", "facebook"],
      default: ["local"],
    },
    // removed explicit createdAt since timestamps:true adds it
  },
  {
    timestamps: true,
  }
);

/* unique index explicitly */
userSchema.index({ email: 1 }, { unique: true });

/* ---------- Middleware: hash password ---------- */
/* NOTE: use typed 'this' and async middleware (no next callback) */
userSchema.pre<UserDocument>("save", async function () {
  if (!this.isModified("passwordHash")) return; // nothing to do
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

/* ---------- Instance method: comparePassword ---------- */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.passwordHash) return false;
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (err) {
    // optionally log error
    return false;
  }
};

/* ---------- Hide sensitive fields when returning JSON ---------- */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

/* ---------- Model export (safe for hot-reload / serverless) ---------- */
export const User: UserModel =
  (mongoose.models.User as UserModel) ||
  model<IUser, UserModel>("User", userSchema);
