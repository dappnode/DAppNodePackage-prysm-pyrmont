import memoizee from "memoizee";
import { NodeStats, BeaconProviderName } from "../../common";
import * as db from "../db";
import { getBeaconNodeClient } from "../services/beaconNode";

async function getNodeStats(
  beaconNode: BeaconProviderName
): Promise<NodeStats> {
  const beaconNodeClient = getBeaconNodeClient(beaconNode);
  return {
    syncing: await beaconNodeClient.syncing(),
    peers: await beaconNodeClient.peers()
  };
}

const getNodeStatsMem = memoizee(getNodeStats, {
  maxAge: 12 * 1000,
  promise: true
});

export async function nodeStats(): Promise<NodeStats> {
  const beaconNode = db.server.beaconProvider.get();
  if (!beaconNode)
    return {
      syncing: null,
      peers: null
    };

  return await getNodeStatsMem(beaconNode);
}
