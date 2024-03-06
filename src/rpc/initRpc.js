import toFormData from "./formData";

export default function initRpc(src, axios) {
    const rcp = Object.fromEntries(
      Object.entries(src).map(([methodName, route]) => {
        if (typeof route === "string") {
          const method = (...args) => {
            return axios.post(route, toFormData(args)).then((res) => res.data);
          };
  
          return [methodName, method];
        }
  
        return [methodName, initRpc(route, axios)];
      })
    );
  
    return rcp;
  }