import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import * as methods from "./methods";
import { getRpcHandler, wrapRoute } from "../src/utils";
import { serverPort } from "../src/params";
// Display stack traces with source-maps
import "source-map-support/register";

if (process.env.NODE_ENV !== "development")
  throw Error(`This is a mock server only intended for development`);

const app = express();

// Express configuration
app.set("port", serverPort);
app.use(cors()); // default options. ALL CORS
app.use(logger("dev")); // Log requests in "dev" format
app.use(bodyParser.json());
app.post("/rpc", getRpcHandler(methods));

// Auth
app.get("/login", wrapRoute(emptyHandler));
app.post("/login", wrapRoute(emptyHandler));
app.get("/logout", wrapRoute(emptyHandler));

app.listen(app.get("port"), () => {
  /* eslint-disable-next-line no-console */
  console.warn(`Mock app listening http://localhost:${app.get("port")}`);
});

/**
 * Simulate a non error response, resulting in 200 code
 */
function emptyHandler(): void {
  return;
}
