import path from "path";
import fs from "fs";
import { createLowDb } from "./lowDb";
import { createDb, collection, regular } from "./dbAdaptor";
import {
  DepositEvents,
  ValidatorClientName,
  BeaconProviderName
} from "../../common";
import { getRandomToken } from "../utils";
import { dbDir, dataPath } from "../params";
import { logs } from "../logs";

export const sessionsPath = path.join(dbDir, "sessions");
const serverDbPath = path.join(dbDir, "server-db.json");
const accountsDbPathOld = path.join(dbDir, "account-db.json");
const accountsDbPath = path.join(dataPath, "eth1Keymanager.json");
const depositsDbPath = path.join(dbDir, "deposits-db.json");

// Migrate accounts DB if exists
try {
  fs.copyFileSync(accountsDbPathOld, accountsDbPath);
} catch (e) {
  if (e.code !== "ENOENT") logs.error(`Error migrating accounts db`, e);
}

export const server = createDb(createLowDb(serverDbPath), {
  sessionsSecret: regular<string>(),
  validatorClient: regular<ValidatorClientName>(),
  beaconProvider: regular<BeaconProviderName>()
});

export const accounts = createDb(createLowDb(accountsDbPath), {
  eth1: regular<{ address: string; privateKey: string }>()
});

export const deposits = createDb(createLowDb(depositsDbPath), {
  depositEvents: collection<DepositEvents>(e => e.publicKey)
});

export function getSessionsSecretKey(): string {
  let secret = server.sessionsSecret.get();
  if (!secret) {
    secret = getRandomToken();
    server.sessionsSecret.set(secret);
  }
  return secret;
}
