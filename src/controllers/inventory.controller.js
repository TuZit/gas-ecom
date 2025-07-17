import { OK } from "../core/response-handler/success.response.js";

class InventoryController {
  async addStockToInventory() {
    new OK({
      message: "Added Stock To Inventory",
      metadata: await InventoryService.addStockToInventory({ ...req.body }),
    }).send(res);
  }
}

export default new InventoryController();
