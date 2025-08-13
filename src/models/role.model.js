import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// const grantList = [
//   { role: "admin", resource: "profile", action: "update:any", attributes: "*" },
//   {
//     role: "admin",
//     resource: "balance",
//     action: "update:any",
//     attributes: "*, !mount",
//   },

//   {
//     role: "shop",
//     resource: "balance",
//     action: "update:any",
//     attributes: "*, !mount",
//   },
//   {
//     role: "shop",
//     resource: "balance",
//     action: "update:own",
//     attributes: "*, !amount",
//   },

//   { role: "user", resource: "profile", action: "update:own", attributes: "*" },
//   { role: "user", resource: "profile", action: "read:own", attributes: "*" },
// ];

const roleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    rol_slug: { type: String, required: true },
    rol_status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    rol_description: { type: String, default: "" },
    rol_grants: [
      {
        resource: {
          // được phép truy cập loại resource nào
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        // được phép actions(chỉnh sửa/xoá) nào
        actions: { type: String, required: true },
        // được phép actions tới phần nào
        attributes: { type: String, default: "**" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const roleModel = model(DOCUMENT_NAME, roleSchema);
export default roleModel;
