import { Schema } from "mongoose";

const DOCUMENT_NAME = "Template";
const COLLECTION_NAME = "Templates";
// Declare the Schema of the Mongo model
const templateSchema = new Schema(
  {
    tem_userId: { type: Number, required: true },
    tem_name: { type: String, required: true },
    tem_status: { type: String, default: "active" },
    tem_html: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const templateModel = model(DOCUMENT_NAME, templateSchema);
export default templateModel;
