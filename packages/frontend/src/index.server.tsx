import express from "express";
import path from "path";
import fs from "fs";
import { renderToString } from "react-dom/server";
import pages from './pages';
import { Server } from './App';

const build = path.join(__dirname, "build");
const index = path.join(__dirname, "build.html");

const html = fs.readFileSync(index, "utf8")

export default function reactAppMiddleware() {
    const router = express.Router();

    const tasks = pages.map(async ([pattern, import$]) => {
        const { default: Page, ...mod } = await import$();

        if (!(mod as any).onProps) {
            const filename = renderWithCache(pattern, Page);
            router.get(pattern, (req, res) => res.sendFile(filename));

            return;
        }

        router.get(pattern, (req, res) => {
            const el = renderToString(<Server pathname={req.url}><Page /></Server>)

            console.log({ el, url: req.url })

            res.send(html.replace('<div id="root"></div>', `<div id="root">${el}</div>`))
        });
    })

    Promise.all(tasks).catch(err => {
        throw err
    })

    router.use(express.static(build));

    return router;
}


function renderWithCache(pattern: string, Page: () => JSX.Element) {
    let filename = pattern.endsWith("/") ? pattern + "index" : pattern
    filename = path.join(__dirname, "." + filename + ".html");

    if (fs.existsSync(filename)) {
        return filename
    }

    const dir = path.dirname(filename);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }


    const el = renderToString(<Server pathname={pattern}><Page /></Server>);

    fs.writeFileSync(filename, html.replace('<div id="root"></div>', `<div id="root">${el}</div>`), {})

    return filename;
}