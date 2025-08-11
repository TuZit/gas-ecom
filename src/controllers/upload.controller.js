import { BadRequestError } from "../core/response-handler/error.response.js";
import { OK } from "../core/response-handler/success.response.js";
import {
  uploadImageFromLocal,
  uploadImageFromUrl,
} from "../services/upload.service.js";

class UploadController {
  async uploadFile(req, res, next) {
    new OK({
      message: "Upload file successfully!",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  }

  async uploadFileThumbnail(req, res, next) {
    if (!req.file) {
      throw new BadRequestError(
        "File type is not allowed. Only jpg/jpeg/png is allowed"
      );
    }
    new OK({
      message: "Upload file successfully!",
      metadata: await uploadImageFromLocal({ path: req.file.path }),
    }).send(res);
  }
}

export default new UploadController();
