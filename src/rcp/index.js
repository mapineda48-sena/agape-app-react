import axios from "./axios";
import toFormData from "./formData";

export let rcp = {};

export async function sync() {
  const { data: endpoint } = await axios().get("/rcp");

  rcp = initRcp(endpoint, axios());

  return rcp;
}

export function initRcp(src, axios) {
  const rcp = Object.fromEntries(
    Object.entries(src).map(([methodName, route]) => {
      if (typeof route === "string") {
        const method = (...args) => {
          return axios.post(route, toFormData(args)).then((res) => res.data);
        };

        return [methodName, method];
      }

      return [methodName, initRcp(route, axios)];
    })
  );

  return rcp;
}

sync();

export default rcp;
