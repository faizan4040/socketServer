import mongoose from "mongoose";

export const ACTIVE_STATUSES = ["requested", "confirmed", "arrived", "started", "work_completed"];
export const BUSY_STATUSES = ["confirmed", "arrived", "started", "work_completed"];

const S = mongoose.Schema.Types;
const point = new mongoose.Schema(
  { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } },
  { _id: false }
);
const history = new mongoose.Schema(
  { status: String, at: { type: Date, default: Date.now }, by: { type: S.ObjectId, ref: "User" }, byRole: String, note: String },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: S.ObjectId, ref: "User", required: true },
    labour: { type: S.ObjectId, ref: "User", required: true },
    labourProfile: { type: S.ObjectId, ref: "Labour" },
    category: { type: String, required: true },

    workAddress: { type: String, required: true },
    siteDetails: { type: String, default: "" },
    workLocation: { type: point, required: true },

    fare: { type: Number, required: true },
    pricingType: { type: String, enum: ["hourly", "daily"], required: true },
    durationKey: String,
    duration: { type: Number, required: true },
    ratePerUnit: { type: Number, required: true },
    userMobileNumber: { type: String, required: true },

    bookingStatus: {
      type: String,
      enum: ["idle", "requested", "confirmed", "arrived", "started", "work_completed", "completed",
        "cancelled", "rejected", "expired", "awaiting_payment"],
      default: "requested",
    },
    requestExpiresAt: Date,
    acceptedAt: Date,
    arrivedAt: Date,
    startedAt: Date,
    completedAt: Date, // work finished (labour clicked Complete)
    closedAt: Date,    // OTP verified, booking closed, money settled
    workDurationMinutes: Number,

    paymentMethod: { type: String, enum: ["cash", "online"] },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cash", "failed", "refund_pending", "refunded"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paidAt: Date,
    refundId: String,

    commissionRate: { type: Number, default: 0 },
    adminCommission: { type: Number, default: 0 },
    labourAmount: { type: Number, default: 0 },

    completeOtpEnc: { type: String, select: false },
    completeOtpExpires: { type: Date, select: false },
    completeOtpAttempts: { type: Number, default: 0, select: false },

    cancellationReason: { type: String, default: "" },
    cancelledBy: { type: String, enum: ["", "customer", "labour", "system", "admin"], default: "" },
    reviewed: { type: Boolean, default: false },

    history: [history],
  },
  { timestamps: true }
);

bookingSchema.index({ labour: 1, bookingStatus: 1, requestExpiresAt: 1 });
bookingSchema.index({ user: 1, bookingStatus: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ closedAt: -1 });
bookingSchema.index({ razorpayOrderId: 1 }, { sparse: true });
bookingSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { bookingStatus: { $in: ACTIVE_STATUSES } } });
bookingSchema.index({ labour: 1 }, { unique: true, partialFilterExpression: { bookingStatus: { $in: BUSY_STATUSES } } });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;









