import { ValidatorFiles } from "../../common";
import { prysmBinary, keystoreManager } from "../prysm";

/**
 * Import validator keystores and passphrases, store them locally
 * and restart validator client to apply
 */
export async function importValidators(
  validatorsFiles: ValidatorFiles[]
): Promise<void> {
  await keystoreManager.importKeystores(validatorsFiles);
  await prysmBinary.restart();
}
