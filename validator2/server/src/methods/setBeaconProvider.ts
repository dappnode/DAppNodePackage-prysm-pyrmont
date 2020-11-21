import { BeaconProviderName } from "../../common";
import * as db from "../db";
import { getClient } from "../services/validatorClient";

/**
 * Set beacon provider URL or name to which validator clients connect to
 */
export async function setBeaconProvider(
  beaconProvider: BeaconProviderName
): Promise<void> {
  const prevBeaconProvider = db.server.beaconProvider.get();
  if (prevBeaconProvider === beaconProvider) return;

  db.server.beaconProvider.set(beaconProvider);

  const client = db.server.validatorClient.get();
  if (client) await getClient(client).restart();
}
