import { ValidatorClient } from "./generic";
import { lighthouseBinary, lighthouseKeystoreManager } from "./lighthouse";
import { prysmBinary, prysmKeystoreManager } from "./prysm";
import { ValidatorClientName } from "../../../common";

const prysmClient = new ValidatorClient(prysmBinary, prysmKeystoreManager);
const lighthouseClient = new ValidatorClient(
  lighthouseBinary,
  lighthouseKeystoreManager
);

export function getClient(clientName: ValidatorClientName): ValidatorClient {
  switch (clientName) {
    case "lighthouse":
      return lighthouseClient;

    case "prysm":
      return prysmClient;

    default:
      throw Error(`Unsupported client ${clientName}`);
  }
}
