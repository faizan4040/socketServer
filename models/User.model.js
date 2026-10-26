import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "customer", "shop owner", "laber", "delivery boy"],
      default: "customer",
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    avatar: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedAt: {
      type: Date,
      default: null,
    },
    blockReason: {
      type: String,
      default: "",
    },

    // ── Partner onboarding (labour) ──
    partnerOnBoardingSteps: {
      type: Number,
      min: 0,
      max: 8,
      default: 0,
    },
    partnerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },

    // ── OTP ──
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },

    // ── Socket.io ──
    socketId: {
      type: String,
      default: null,
    },

    location: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number], default: undefined },
    },
    locationUpdatedAt: { type: Date, default: null },
    
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ── Video KYC ──
    videoKycStatus: {
      type: String,
      enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
      default: "not_required",
    },
    videoKycRoomId: {
      type: String,
      default: null,
    },
    videoKycRejectionReason: {
      type: String,
      default: "",
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

const UserModel =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");

export default UserModel;