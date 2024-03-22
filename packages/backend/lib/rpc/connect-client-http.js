import _ from "lodash";
import _axios from "axios";
import toFormData from "./connect-client-form";
import { ApiKey, ApiKeyHeader, rpc as service } from "./connect-config";

export const axios = _axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000",

  headers: {
    [ApiKeyHeader]: ApiKey,
  },
});

export default async function syncRpc() {
  const { data: endpoint } = await axios.get(service);

  return initRpc(endpoint);
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
