import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import logger from "morgan";
import cors from "cors";
import * as methods from "./methods";
import * as db from "./db";
import * as auth from "./auth";
import { uiFilesPath, serverPort, logDebug } from "./params";
import { getRpcHandler, wrapRoute, wrapMiddleware } from "./utils";
import { downloadKeystoresBackup } from "./routes/backup";
// Display stack traces with source-maps
import "source-map-support/register";
const FileStore = require("session-file-store")(session);

const app = express();

// Express configuration
app.set("port", serverPort);
app.use(cors()); // default options. ALL CORS
app.use(
  logger("short", { skip: (_, res) => res.statusCode < 500 && !logDebug })
); // Log error requests in "dev" format
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(uiFilesPath), { maxAge: "1d" })); // Express uses "ETags" (hashes of the files requested) to know when the file changed
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: db.getSessionsSecretKey(),
    store: new FileStore({ path: db.sessionsPath, ttl: 86400 })
  })
);

app.get("/login", wrapRoute(auth.onlyAdmin));
app.post("/login", wrapRoute(auth.loginAdmin));
app.get("/logout", wrapRoute(auth.logoutAdmin));
app.post("/rpc", wrapMiddleware(auth.onlyAdmin), getRpcHandler(methods));
app.get("/backup", wrapMiddleware(auth.onlyAdmin), downloadKeystoresBackup);
app.get("/ping", (req, res) => res.send(`DAppNode Prysm dashboard`));
app.get("*", (_0, res) =>
  res.sendFile(path.resolve(uiFilesPath, "index.html"))
); // React-router, index.html at all routes

export default app;
