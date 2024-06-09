import express from "express";
import path from "path";
import fs from "fs";
import os from "os";
import { renderToString } from "react-dom/server";
import { Server, routes as pages } from "./App/Page";
import { Fragment } from "react/jsx-runtime";

const tmpdir = os.tmpdir();

const build = path.join(__dirname, "build");
const index = path.join(__dirname, "build.html");

const html = fs.readFileSync(index, "utf8");

export default function reactAppMiddleware() {
  const router = express.Router();

  const tasks = pages.map(async ([pattern, import$]) => {
    const { default: Page, OnInit } = await import$();

    if (!OnInit) {
      const filename = renderWithCache(pattern, Page);
      router.get(pattern, (req, res) => res.sendFile(filename));

      return;
    }

    router.get(pattern, async (req, res) => {
      const props = await OnInit();

      const html = renderHtml(
        <Fragment>
          <div id="root">
            <Server pathname={req.url}>
              <Page {...props} />
            </Server>
          </div>
          <script
            id="props"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(props) }}
          />
        </Fragment>
      );

      res.send(html);
    });
  });

  Promise.all(tasks).catch((err) => {
    throw err;
  });

  router.use(express.static(build));

  return router;
}

function renderWithCache(pattern: string, Page: () => JSX.Element) {
  let filename = pattern.endsWith("/") ? pattern + "index" : pattern;
  filename = path.join(tmpdir, "agape-app-page", "." + filename + ".html");

  if (fs.existsSync(filename)) {
    return filename;
  }

  const dir = path.dirname(filename);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const html = renderHtml(
    <div id="root">
      <Server pathname={pattern}>
        <Page />
      </Server>
    </div>
  );

  fs.writeFileSync(filename, html);

  return filename;
}

function renderHtml(Page: JSX.Element) {
  return html.replace('<div id="root"></div>', renderToString(Page));
}
