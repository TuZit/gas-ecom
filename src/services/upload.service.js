import cloudinary from "../core/configs/cloudinary.config.js";

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgurcl7xiwab80";
    const folderName = "product/shopId",
      newFileName = "testdemo";
    const result = await cloudinary.v2.uploader.upload(urlImage, {
      // public_id: newFileName
      folder: folderName,
    });
    console.log(result);
  } catch (error) {}
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.v2.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: cloudinary.v2.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console - error("Error uploading image::", error);
  }
};

export { uploadImageFromUrl, uploadImageFromLocal };
