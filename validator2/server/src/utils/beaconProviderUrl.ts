import * as db from "../db";
import { LIGHTHOUSE_VALIDATOR_APIURL, PRYSM_VALIDATOR_APIRUL } from "../params";

export function getBeaconProviderUrl(): string {
  const beaconProvider =
    db.server.beaconProvider.get() ||
    db.server.validatorClient.get() ||
    "lighthouse";

  switch (beaconProvider) {
    case "lighthouse":
      return LIGHTHOUSE_VALIDATOR_APIURL;
    case "prysm":
      return PRYSM_VALIDATOR_APIRUL;
    default:
      throw Error(`Not supported beacon provider ${beaconProvider}`);
  }
}
