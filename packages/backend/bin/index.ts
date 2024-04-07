import express from "express";
import cors from "cors";
import logger from "morgan";
import rcp from "../lib/rpc/connect-router";
import db from "../lib/models";
import { Sequelize } from "sequelize";
import cls from "cls-hooked";
import * as demo from "../lib/demo";
import Storage from "../lib/storage";

/**
 * PostreSQL
 */
const seq = new Sequelize(
  process.env.DATABASE_URL ?? "postgresql://postgres:mypassword@127.0.0.1"
);

// https://sequelize.org/docs/v6/other-topics/transactions/#automatically-pass-transactions-to-all-queries
const namespace = cls.createNamespace("agape");
Sequelize.useCLS(namespace);

/**
 * Http Server
 */
const isDev = process.env.NODE_ENV !== "production";
const origin = isDev ? "http://localhost:3000" : undefined;
const app = express();

/**
 * Boot App
 */
(async function bootApp() {
  //Database
  await demo.resetSchema(seq);
  await db.define(seq);
  await demo.populateSchema();

  //Storage
  await Storage.Init(
    process.env.STORAGE_URL ?? "http://minio:minio123@127.0.0.1:9000"
  );

  //App
  app.use(cors({ origin }));
  app.use(logger("dev"));
  app.use(rcp);
  app.use(express.static("build"));

  app.listen(5000, () => console.log("server at port 5000"));
})().catch((error) => {
  throw error;
});
