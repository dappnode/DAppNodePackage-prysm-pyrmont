import { logs } from "./logs";
import app from "./app";
import * as db from "./db";
import { listenToDepositEvents } from "./services/eth1";
import { printGitData } from "./services/printGitData";
import { getClient } from "./services/validatorClient";

// Connect to a Eth1.x node
listenToDepositEvents();
// For debugging only: print DNP version, git branch and commit
printGitData();

// Start validator binary if ready
const currentClient = db.server.validatorClient.get();
if (currentClient) {
  getClient(currentClient)
    .restart()
    .then(
      () => logs.info(`Started validator client ${currentClient}`),
      e => logs.error(`Error starting validator client`, e)
    );
} else {
  logs.info(`No validator client selected yet`);
}

/**
 * Start Express server.
 */
const port = app.get("port");
const env = app.get("env");
const server = app.listen(port, () => {
  logs.info(`App is running at http://localhost:${port} in ${env} mode`);
});

// For testing
export default server;
