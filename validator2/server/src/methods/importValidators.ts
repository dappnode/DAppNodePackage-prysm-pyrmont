import { ValidatorFiles } from "../../common";
import { keystoreManager } from "../services/keystoreManager";
import * as db from "../db";
import { getClient } from "../services/validatorClient";

/**
 * Import validator keystores and passphrases, store them locally
 * and restart validator client to apply
 */
export async function importValidators(
  validatorsFiles: ValidatorFiles[]
): Promise<void> {
  await keystoreManager.importKeystores(validatorsFiles);

  const clientName = db.server.validatorClient.get();
  if (clientName) {
    const client = getClient(clientName);
    await client.stop();
    await client.restart({ reImportKeystores: true });
  }
}
