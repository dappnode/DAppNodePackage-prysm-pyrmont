import { PRYSM_REST_APIURL } from "../params";
import { PrysmBeaconNodeClient } from "./beaconNode";
export * from "./beaconNode";
export * from "./keystoreManager";
export * from "./validatorClient";

export const prysmBeaconNodeClient = new PrysmBeaconNodeClient(
  PRYSM_REST_APIURL
);
