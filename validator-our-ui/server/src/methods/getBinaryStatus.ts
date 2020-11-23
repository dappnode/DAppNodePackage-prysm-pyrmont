import { ChildProcessStatus } from "../../common";
import { prysmBinary } from "../prysm";

export async function getBinaryStatus(): Promise<ChildProcessStatus> {
  return prysmBinary.getStatus();
}
