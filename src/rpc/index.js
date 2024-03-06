const axios = require("./axios").default;
const initRcp = require("./initRpc").default;

exports.rpc = (async () => {
  const { data: endpoint } = await axios().get("/rpc");

  const rpc = initRcp(endpoint, axios());

  Object.entries(rpc).forEach(([key, fn]) => (exports[key] = fn));

  console.log(rpc);
})().catch(console.error);

