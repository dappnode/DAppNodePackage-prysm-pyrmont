// Server types

export type ValidatorClientName = "lighthouse" | "prysm";
export type BeaconProviderName = "lighthouse" | "prysm";

export interface AppSettings {
  validatorClient: ValidatorClientName | undefined;
  beaconProvider: BeaconProviderName | undefined;
  beaconDnps: { [key in BeaconProviderName]: DnpInstalledStatus };
  dmsDnp: DnpInstalledStatus;
}

// Table type

export interface ValidatorStats {
  index: number;
  publicKey: string;
  depositEvents: DepositEvent[];
  status?: string;
  balance: {
    eth: number | null; // 32.4523
    isExpected: boolean;
  };
}

export interface ValidatorFiles {
  pubkey: string;
  keystore: Eth2Keystore;
  passphrase: string;
}

/**
 * Name: keystore-m_12381_3600_0_0_0-1595959302.json
 */
export interface Eth2Keystore {
  crypto: object; // { ... }
  pubkey: string; // "b709108cf222c87d64526c393d872961f647f438b483365c14e5c0a26d08862cf06d10e630a71816c1920cb8ac699260",
  path?: string; // "m/12381/3600/0/0/0"
  uuid?: string; // "deba008c-3b56-4f49-981b-0e62fd6c0171"
  version?: number; // 4
}

/**
 * Name: deposit_data-1595959302.json
 */
export interface Eth2Deposit {
  pubkey: string; // "b709108cf222c87d64526c393d872961f647f438b483365c14e5c0a26d08862cf06d10e630a71816c1920cb8ac699260";
  withdrawal_credentials: string; // "0064c79b20681cb57c1daecabb8400526900669ed4a1f94905fabb5795d13f3a";
  amount: number; // 32000000000;
  signature: string; // "b5701e1fb2508d6e02a79c4bad5bbd0ee5b5a05bc5b629bc297e226b3f8db8e7ed1d2ee070d7bd9c9a9cdb7ce93602b9179849c097887a2e91c4d92c02377044c32b0f740ccc7745d6179131b630959407e1f10a00ac9b4d34080ce8ab5a8df4";
  deposit_message_root: string; // "b6b69067410548d177b058dbb91902c55dfe136bbbc354d3ccef8506bfd67d5f";
  deposit_data_root: string; // "a50df4aabd8046393ca7064a2dad1048f0bd3dbc8f79e04dcc663dd1ed07af6d";
  fork_version: string; // "00000001";
}

// Old types

export interface DepositEvents {
  publicKey: string;
  events: {
    [transactionHashAndLogIndex: string]: DepositEvent;
  };
}

export interface DepositEvent extends DepositEventArgs {
  blockNumber: number | undefined;
  transactionHash: string | undefined;
}

export interface NodeStats {
  peers: string[] | null;
  syncing: SyncStatus | null;
}

// Prysm deposit contract

export interface DepositEventArgs {
  pubkey: string; // '0xb01d89a3abf76b659e0ddfe7f08bc2df7900e70a9ac0dadef40ec4364cfc10bd679cf939b3497856f719101d33ef2eea',
  withdrawal_credentials: string; // "0x00b6589882996478845d4dd2ca85a57387d6a392217808c908add83b160a0fa7";
  amount: string; // "0x0040597307000000";
  signature: string; // "0x9085a737a4490a403e9d0773abcb283b39270a97df7e6fc95c10ac6e6ade3698a88d00b0712fd95b3c2c519035b829160efa34962c92d1dd440db532c5b9bdabf91c7927c3ca1350eb2eb0b52700abd2e704bb547a2dd1ecfa0368a4d72da5e6";
  index: string; // "0x6200000000000000";
}

export const depositEventAbi = {
  name: "DepositEvent",
  inputs: [
    { type: "bytes", name: "pubkey", indexed: false },
    { type: "bytes", name: "withdrawal_credentials", indexed: false },
    { type: "bytes", name: "amount", indexed: false },
    { type: "bytes", name: "signature", indexed: false },
    { type: "bytes", name: "index", indexed: false },
  ],
  anonymous: false,
  type: "event",
};

// Metrics from Node's gRPC gateway

export type ValidatorMetrics = Partial<ValidatorStatus> &
  Partial<ValidatorData> & { publicKey: string };

export interface ValidatorStatus {
  /**
   * DEPOSITED - validator's deposit has been recognized by Ethereum 1, not yet recognized by Ethereum 2.
   * PENDING - validator is in Ethereum 2's activation queue.
   * ACTIVE - validator is active.
   * EXITING - validator has initiated an an exit request, or has dropped below the ejection balance and is being kicked out.
   * EXITED - validator is no longer validating.
   * SLASHING - validator has been kicked out due to meeting a slashing condition.
   * UNKNOWN_STATUS - validator does not have a known status in the network.
   */
  status: string;
  index: string | null;
  balance: string | null;
}

export interface ValidatorData {
  publicKey: string; // "tO1tB5njWwO5oc5MrJJ46P6PwGxKjKzsz48yxDQ/G9RJHcURtY6v4UQGDsrNijf3",
  withdrawalCredentials: string; // "ANYN9tCy0rm4uUARNiT9qT2N2xwREjiRJqfsfTZBG9A="
  effectiveBalance: string; // "32000000000"
  slashed: boolean; // false
  activationEligibilityEpoch: string; // "0"
  activationEpoch: string; // "0"
  exitEpoch: string; // "18446744073709551615"
  withdrawableEpoch: string; // "18446744073709551615"
}
export interface BeaconNodeChainhead {
  headSlot: number; // 177684,
  headBlockRoot: string; // 'y1GDABJ0iPgZhdcWBXTon4r2TgEnpS3XFISckLyqa+U=',
  finalizedSlot: number; // 177600,
  slotsPerEpoch: number; // 32
}

export type SyncStatus = {
  /**
   * Head slot node is trying to reach
   */
  head_slot: string;
  /**
   * How many slots node needs to process to reach head. 0 if synced.
   */
  sync_distance: string;
};

/**
 * DAPPMANAGER Type, from the public API
 * Not accessible directly from the browser due to CORS
 */
export interface DnpInstalledPackage {
  name: string; // "ipfs.dnp.dappnode.eth";
  ip: string; // "172.33.1.5"; "" if not set
  state: "running" | "exited" | string; // or other docker status
  version: string; // "0.2.10";
}

export type DnpInstalledStatus =
  | (DnpInstalledPackage & { status: "installed" })
  | { name: string; installUrl: string; status: "not-installed" }
  | { name: string; status: "fetch-error"; error: string };

/**
 * Informative status about the internal child_process (validator client)
 */
export interface ChildProcessStatus {
  recentCrashes: ChildProcessCrashData[];
  pid: number | null;
  runningSince: number | null;
}

export interface ChildProcessCrashData {
  code: number | null;
  command: string;
  args: string[];
  timestamp: number;
  logs: string[];
}
