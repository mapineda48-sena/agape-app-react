import customers from "./data/customers.json";
import Database from "../../models";

export default async function populateDate() {
  return Promise.all(customers.map((r) => Database.customer.create(r)));
}
