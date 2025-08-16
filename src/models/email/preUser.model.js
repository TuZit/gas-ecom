const preUserSchema = new Schema(
  {
    pre_token: {
      type: String,
      required: true,
    },
    pre_email: { type: String, required: true },
    tem_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },
  { collection: "preUser", timestamps: true }
);
