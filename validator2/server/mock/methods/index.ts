import crypto from "crypto";
import {
  ValidatorStats,
  NodeStats,
  ValidatorFiles,
  AppSettings,
  ValidatorClientName,
  BeaconProviderName,
  ChildProcessStatus
} from "../../common";
import {
  LIGHTHOUSE_DNPNAME,
  PRYSM_DNPNAME,
  PRYSM_INSTALL_URL,
  DMS_DNPNAME,
  DMS_INSTALL_LINK
} from "../../src/params";

// New state
const validators = new Map<number, ValidatorStats>();
const settings: AppSettings = {
  validatorClient: undefined,
  beaconProvider: undefined,
  beaconDnps: {
    lighthouse: {
      name: LIGHTHOUSE_DNPNAME,
      status: "installed",
      ip: "172.33.1.5",
      state: "exited",
      version: "0.2.10"
    },
    prysm: {
      name: PRYSM_DNPNAME,
      installUrl: PRYSM_INSTALL_URL,
      status: "not-installed"
    }
  },
  dmsDnp: {
    name: DMS_DNPNAME,
    installUrl: DMS_INSTALL_LINK,
    status: "not-installed"
  }
};

// Add some mock validators to start with
// addValidatorToMockSet();
// addValidatorToMockSet();

function addValidatorToMockSet(): void {
  const index = validators.size;
  const publicKey = "0x" + crypto.randomBytes(48).toString("hex");
  const transactionHash = "0x" + crypto.randomBytes(32).toString("hex");
  const blockNumber = Math.ceil(100000 * Math.random());

  validators.set(index, {
    index,
    publicKey,
    depositEvents: [
      {
        transactionHash,
        blockNumber,
        pubkey: publicKey,
        withdrawal_credentials:
          "0x00b6589882996478845d4dd2ca85a57387d6a392217808c908add83b160a0fa7",
        amount: "0x0040597307000000",
        signature:
          "0x9085a737a4490a403e9d0773abcb283b39270a97df7e6fc95c10ac6e6ade3698a88d00b0712fd95b3c2c519035b829160efa34962c92d1dd440db532c5b9bdabf91c7927c3ca1350eb2eb0b52700abd2e704bb547a2dd1ecfa0368a4d72da5e6",
        index: "0x6200000000000000"
      }
    ],
    status: "DEPOSITED",
    balance: {
      eth: 32,
      isExpected: true
    }
  });
}

// New routes

export async function addValidators(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    addValidatorToMockSet();
  }
}

export async function getValidators(): Promise<ValidatorStats[]> {
  return Array.from(validators.values());
}

// Node stats
export async function nodeStats(): Promise<NodeStats> {
  return {
    peers: [
      "/ip4/104.36.201.234/tcp/13210/p2p/16Uiu2HAm5RX4gAQtwqArBmuuGugUXAViKaKBx6ugDJb1L1RFcpfK"
    ],
    syncing: { head_slot: "1234", sync_distance: "12" }
  };
}

export async function importValidators(
  validators: ValidatorFiles[]
): Promise<void> {
  await waitMs(5000);
  // eslint-disable-next-line no-console
  console.log(`Importing validator files`, validators);
}

export async function getSettings(): Promise<AppSettings> {
  await waitMs(500);
  return settings;
}

export async function switchValidatorClient(
  nextClient: ValidatorClientName
): Promise<void> {
  await waitMs(1000);
  settings.validatorClient = nextClient;
}

export async function setBeaconProvider(
  beaconProvider: BeaconProviderName
): Promise<void> {
  await waitMs(1000);
  settings.beaconProvider = beaconProvider;
}

export async function getBinaryStatus(): Promise<ChildProcessStatus | null> {
  if (!settings.validatorClient) return null;
  else
    return {
      recentCrashes: Array(8).fill({
        code: 1,
        command: "ligthhouse",
        args: ["--testnet medalla"],
        timestamp: Date.now() - 30 * 1000,
        logs: [
          "slot: 7091, epoch: 221, validators: 10, service: notifier",
          "Aug 05 12:38:38.005 INFO Awaiting activation                     slot: 7092, epoch: 221, validators: 10, service: notifier",
          "Aug 05 12:38:50.003 INFO Awaiting activation                     slot: 7093,",
          "epoch: 221, validators: 10, service: notifier",
          "Aug 05 12:39:02.003 INFO Awaiting activation                     slot: 7094, epoch: 221, validators: 10, service: notifier",
          "Aug 05 12:39:14.002 INFO Awaiting activation                     slot: 7095, epoch: 221, validators: 10, service: notifier",
          "Aug 05 12:39:26.002 INFO Awaiting activation                     slot: 7096, epoch: 221, validators: 10, service: notifier",
          `level=fatal msg="Could not determine if beacon chain started: could not receive ChainStart from stream: rpc error: code = Unimplemented desc = Not Found: HTTP status code 404; transport: received the unexpected content-type "text/plain; charset=utf-8"" prefix=validator`
        ]
      }),
      pid: 153,
      runningSince: Date.now() - 5 * 60 * 1000
    };
}

// Helpers

function waitMs(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
