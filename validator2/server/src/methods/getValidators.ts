import memoizee from "memoizee";
import { ethers } from "ethers";
import * as db from "../db";
import { ValidatorStats, DepositEvent } from "../../common";
import { SHOW_ALL_VALIDATORS } from "../params";
import { computeExpectedBalance } from "../utils";
import { requestPastDepositEvents } from "../services/eth1";
import {
  prysmBeaconNodeClient,
  prysmKeystoreManager,
  ValidatorStatusByPubkey
} from "../prysm";
import { logs } from "../logs";

async function getValidatorStatus(
  pubkeys: string[]
): Promise<ValidatorStatusByPubkey> {
  const syncingStatus = await prysmBeaconNodeClient.syncing();
  // > operator works with strings
  const isSyncing = parseInt(syncingStatus.sync_distance) > 0;
  if (isSyncing) {
    return {};
  } else {
    return await prysmBeaconNodeClient.validators(pubkeys);
  }
}

const getValidatorStatusMem = memoizee(getValidatorStatus, {
  maxAge: 12 * 1000,
  promise: true,
  // Cache by contents of pubKeys not by the array containing it
  normalizer: ([pubkeys]) => pubkeys.sort().join("")
});

/**
 * Show validator stats.
 * Only show validators that have a confirmed deposit
 */
export async function getValidators(): Promise<ValidatorStats[]> {
  // Keep fetching logs in the background only when UI is connected
  requestPastDepositEvents().catch(e => {
    logs.error(`Error requesting past deposit events`, e);
  });

  const pubkeys = await prysmKeystoreManager.getPubkeys();
  const statusByPubkey = await getValidatorStatusMem(pubkeys).catch(e =>
    logs.error(`Error fetching validators balances`, e)
  );

  return pubkeys
    .map(
      (publicKey, index): ValidatorStats => {
        const depositEventsObj = db.deposits.depositEvents.get(publicKey);
        const depositEvents = Object.values(depositEventsObj?.events || {});
        const { status, balance } = (statusByPubkey || {})[publicKey] || {};

        return {
          index,
          publicKey,
          depositEvents,
          status,
          balance: computeBalance({ balance, status }, depositEvents)
        };
      }
    )
    .filter(
      ({ depositEvents, status }) =>
        SHOW_ALL_VALIDATORS || depositEvents.length > 0 || status
    );
}

function computeBalance(
  {
    balance,
    status
  }: {
    balance?: string | null;
    status?: string;
  },
  depositEvents: DepositEvent[]
): { eth: number | null; isExpected: boolean } {
  if (
    !balance &&
    (!status || status.includes("UNKNOWN") || status === "DEPOSITED") &&
    depositEvents.length > 0
  ) {
    const expectedBalance = computeExpectedBalance(depositEvents);
    if (expectedBalance)
      return {
        eth: expectedBalance,
        isExpected: true
      };
  }

  return {
    eth:
      typeof balance === "number" || typeof balance === "string"
        ? // API returns the balance in 9 decimals
          parseFloat(ethers.utils.formatUnits(balance, 9)) || null
        : null,
    isExpected: false
  };
}
