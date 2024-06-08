import axio$ from "axios";
import _ from "lodash";
import toForm from "../form/browser";
import { ApiKey, ApiKeyHeader } from "./config";

// Backend Server Configuration
// Determines the base URL depending on the environment (production or development)
const baseURL =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000";

const axios = axio$.create({
    baseURL,
    headers: {
        [ApiKeyHeader]: ApiKey,
    },
});

export default function makeRcp(pathname) {
    return (...args) => {
        return axios
            .post(pathname, toForm(args), { withCredentials: true })
            .then(({ data: [payload, dates] }) => {
                dates.forEach(([path, date]) => _.set(payload, path, new Date(date)));

                return payload;
            });
    }
}