import mongoose from "mongoose";

// Thay thế bằng connection string của bạn.
// Nên được lưu trong file config hoặc biến môi trường.
const connectString =
  "mongodb+srv://papadracula141:P3CqV6pLBiM6wqBQ@cluster0.xtjkdg9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

class Database {
  constructor() {
    this.connect();
  }

  // connect method
  connect(type = "mongodb") {
    // Bật chế độ debug của mongoose trong môi trường dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        // maxPoolSize: 50,
      })
      .then(() => console.log("Connected to MongoDB Successfully"))
      .catch((err) => console.log("Error Connecting to MongoDB!", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
