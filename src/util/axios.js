import _ from "lodash";
import _axios from "axios";
import toFormData from "./formData";

export const axios = _axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000",
});

export default async function syncRpc() {
  const { data: endpoint } = await axios.get("/rpc");

  const rpc = initRpc(endpoint);

  return toLocalModules(rpc);
}

function toLocalModules(obj, baseKey = "./") {
  return _.transform(
    obj,
    (result, value, key) => {
      if (_.isPlainObject(value)) {
        result.push(...toLocalModules(value, `${baseKey}${key}/`));
        return;
      }

      result.push([`${baseKey}index.js`, key, value]);
    },
    []
  );
}

function initRpc(src) {
  const rcp = Object.fromEntries(
    Object.entries(src).map(([methodName, route]) => {
      if (typeof route === "string") {
        const method = (...args) => {
          return axios.post(route, toFormData(args)).then((res) => res.data);
        };

        return [methodName, method];
      }

      return [methodName, initRpc(route)];
    })
  );

  return rcp;
}
