import db from "../../models";
import debug from "../debug";
import populateInventory from "./initInventory";
import populateCustomers from "./customers";

export async function populateSchema() {
  if (!db.isSync) {
    debug.info("Skip populate schema demo ");
    return;
  }

  debug.info("populate schema demo ");
  await populateInventory();
  await populateCustomers();
}
