const axios = require("./axios").default;
const initRcp = require("./initRpc").default;

exports.rpc = (async () => {
  const { data: endpoint } = await axios().get("/rpc");

  Object.entries(initRcp(endpoint, axios())).forEach(
    ([key, fn]) => (exports[key] = fn)
  );
})().catch(console.error);

