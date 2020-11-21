import { ChildProcessStatus } from "../../common";
import * as db from "../db";
import { getClient } from "../services/validatorClient";

export async function getBinaryStatus(): Promise<ChildProcessStatus | null> {
  const client = db.server.validatorClient.get();
  if (!client) return null;
  else return getClient(client).getStatus();
}
