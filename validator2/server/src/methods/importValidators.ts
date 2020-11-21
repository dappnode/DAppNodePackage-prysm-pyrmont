import { ValidatorFiles } from "../../common";
import { prysmBinary, prysmKeystoreManager } from "../prysm";

/**
 * Import validator keystores and passphrases, store them locally
 * and restart validator client to apply
 */
export async function importValidators(
  validators: ValidatorFiles
): Promise<void> {
  await prysmKeystoreManager.importKeystores(validators);
  await prysmBinary.restart();
}
