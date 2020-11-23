import { logs } from "./logs";
import app from "./app";
import { listenToDepositEvents } from "./services/eth1";
import { prysmBinary } from "./prysm";
import { printGitData } from "./utils/printGitData";

// Connect to a Eth1.x node
listenToDepositEvents();
// For debugging only: print DNP version, git branch and commit
printGitData();

// Start validator binary if ready
prysmBinary.restart().then(
  () => logs.info("Started validator client"),
  e => logs.error("Error starting validator client", e)
);

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
