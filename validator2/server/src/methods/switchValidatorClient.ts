import { ValidatorClientName } from "../../common";
import * as db from "../db";
import { getClient } from "../services/validatorClient";

/**
 * Kills `prevClient` running binary ensuring it has exited.
 * Then, it start the `nextClient` binary resolving when data is emitted
 */
export async function switchValidatorClient(
  nextClient: ValidatorClientName
): Promise<void> {
  const prevClient = db.server.validatorClient.get();
  if (prevClient === nextClient) return;

  if (prevClient) await getClient(prevClient).stop();
  await getClient(nextClient).restart();
  db.server.validatorClient.set(nextClient);
}
