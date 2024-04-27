import express from "express";
import path from "path";
import pages from './Router/pages';

const build = path.join(__dirname, "build");
const index = path.resolve(__dirname, "build/index.html");

export default function reactAppMiddleware() {
    const router = express.Router();

    router.use(express.static(build));

    pages.map(([pattern]) => {
        router.get(pattern, (req, res) => res.sendFile(index));
    })

    return router;
}
