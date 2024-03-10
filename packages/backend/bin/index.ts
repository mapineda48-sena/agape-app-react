import express from "express";
import cors from "cors";
import logger from "morgan";
import rcp from '../rpc/connect-router';

const isDev = process.env.NODE_ENV !== "production";

const origin = isDev ? "http://localhost:3000" : undefined;

const app = express();


app.use(cors({ origin }));

app.use(logger("dev"));

app.use(rcp);
app.use(express.static("build"));

app.listen(5000, () => console.log("server at port 5000"));
