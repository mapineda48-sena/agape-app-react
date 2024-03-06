import axios from "axios";

/**
 * Init Axios Instance
 */
export default function create(config) {
  return axios.create({
    ...config,
    baseURL:
      process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000",
  });
}
