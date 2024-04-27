import express from "express";
import path from "path";
import fs from "fs";
import { renderToString } from "react-dom/server";
import pages from './Router/pages';
import App from "./App";
import { createMemoryHistory } from "history";

const build = path.join(__dirname, "build");
const index = path.join(__dirname, "build/index.html");

const html = fs.readFileSync(index, "utf8")

export default function reactAppMiddleware() {
    const router = express.Router();

    pages.map(([pattern]) => {
        router.get(pattern, (req, res) => {
            const history = createMemoryHistory({
                initialEntries: [req.url],
                initialIndex: 0
            });

            const el = renderToString(<App history={history} />)

            console.log({ el, url: req.url })

            res.send(html.replace('<div id="root"></div>', `<div id="root">${el}</div>`))
        });
    })

    router.use(express.static(build));

    return router;
}
