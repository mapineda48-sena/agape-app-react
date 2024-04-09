import express from "express";
import cors from "cors";
import logger from "morgan";
import rcp from "../lib/rpc";
import db from "../lib/models";
import * as demo from "../lib/demo";
import Storage from "../lib/storage";

/**
 * Enviroment
 */
const isDev = process.env.NODE_ENV !== "production";
const port = process.env.AGAPE_PORT ?? "5000";
const jwt = isDev ? __filename : process.env.AGAPE_JWT_SECRET ?? process.exit(1);

// Infraestructure
const databaseUri =
  process.env.AGAPE_DATABASE_URI ??
  "postgresql://postgres:mypassword@127.0.0.1";
const storageUri =
  process.env.AGAPE_STORAGE_URI ?? "http://minio:minio123@127.0.0.1:9000";

//SPA - React Application
const origin = isDev ? "http://localhost:3000" : undefined;

/**
 * Boot App
 */
(async function bootApp() {
  //Database
  await db.Init(databaseUri, isDev);
  await demo.populateSchema();

  //Storage
  await Storage.Init(storageUri);

  //App
  const app = express();

  app.use(cors({ origin, credentials: true }));
  app.use(logger("dev"));

  //Agape Middlewares
  app.use(await rcp(jwt));
  app.use(express.static("build"));

  app.listen(parseInt(port), () => console.log(`server at port ${port}`));
})().catch((error) => {
  throw error;
});
