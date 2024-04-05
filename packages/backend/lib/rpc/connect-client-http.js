const baseURL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000";

export default async function syncRpc() {
  const { default: axios } = await import("axios");
  const { default: toFormData } = await import("./connect-client-form");
  const { ApiKey, ApiKeyHeader, rpc } = await import("./connect-config");

  const service = axios.create({
    baseURL,
    headers: {
      [ApiKeyHeader]: ApiKey,
    },
  });

  const { data } = await service.get(rpc);

  return set(data, (moduleName, action) => [
    moduleName,
    set(action, (method, endpoint) => [
      method,
      (...args) => {
        return service.post(endpoint, toFormData(args)).then((res) => res.data);
      },
    ]),
  ]);
}

function set(src, cb) {
  return Object.fromEntries(
    Object.entries(src).map((entries) => cb(...entries))
  );
}
