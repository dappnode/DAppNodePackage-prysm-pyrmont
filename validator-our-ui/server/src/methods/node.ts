import memoizee from "memoizee";
import { NodeStats } from "../../common";
import { prysmBeaconNodeClient } from "../prysm";

async function getNodeStats(): Promise<NodeStats> {
  return {
    syncing: await prysmBeaconNodeClient.syncing(),
    peers: await prysmBeaconNodeClient.peers()
  };
}

const getNodeStatsMem = memoizee(getNodeStats, {
  maxAge: 12 * 1000,
  promise: true
});

export async function nodeStats(): Promise<NodeStats> {
  return await getNodeStatsMem();
}
