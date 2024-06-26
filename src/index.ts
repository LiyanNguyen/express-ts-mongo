import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookiParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();
import routes from "./routes"

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookiParser());
app.use(bodyParser.json());

const server = http.createServer(app);


server.listen(process.env.PORT, () => {
  console.log(`server running on http://localhost:${process.env.PORT}`);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
app.use(routes);
