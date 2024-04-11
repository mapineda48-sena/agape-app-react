import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import db from "../models";
import * as demo from "../lib/demo";
import Storage from "../lib/storage";
import rcp from "../lib/rpc";
import spa from "../lib/spa";
import debug from "../lib/debug";

/**
 * Enviroment
 */
const isDev = process.env.NODE_ENV !== "production";

const {
  AGAPE_PORT = "5000",
  AGAPE_POSTGRES_URI = "postgresql://postgres:mypassword@127.0.0.1",
  AGAPE_S3_URI = "http://minio:minio123@127.0.0.1:9000",
  AGAPE_JWT_SECRET = isDev ? __filename : process.exit(1),
} = process.env;

//SPA - React Application
const origin = isDev
  ? cors({ origin: "http://localhost:3000", credentials: true })
  : helmet();

/**
 * Boot App
 */
(async function bootApp() {
  // Debug
  await debug.env(isDev);

  //Database
  await db.Init(AGAPE_POSTGRES_URI, isDev);
  await demo.populateSchema();

  //Storage
  await Storage.Init(AGAPE_S3_URI);

  //App
  const app = express();

  app.use(origin);
  app.use(logger(isDev ? "dev" : "common"));

  //Agape Middlewares
  app.use(await rcp(AGAPE_JWT_SECRET));
  app.use(spa());

  app.listen(parseInt(AGAPE_PORT), () =>
    debug.info(`server at port ${AGAPE_PORT}`)
  );
})().catch((error) => {
  throw error;
});
