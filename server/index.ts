import express from "express";
import rcp from './rpc';

const app = express();

app.get("/", (req, res) => res.send("hello world"));
app.use(rcp);
app.use(express.static("public"));

app.listen(5000, () => console.log("server at port 5000"));
