import populateInventory from "./initInventory";

export async function populateSchema() {
  await populateInventory();
}
