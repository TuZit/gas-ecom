import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    us_id: { type: Number, required: true }, // user
    usr_slug: { type: String, required: true },
    usr_name: { type: String, default: "" },
    usr_password: { type: String, default: "" },
    usr_salf: { type: String, default: "" },
    us_email: { type: String, required: true },
    us_phone: { type: String, default: "" },
    usr_sex: { type: String, default: "" },
    usr_avatar: { type: String, default: "" },
    us_date_of_birth: { type: Date, default: null },
    us_role: { type: Schema.Types.ObjectId, ref: "Role" },
    usr_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const userModel = model(DOCUMENT_NAME, userSchema);
export default userModel;
