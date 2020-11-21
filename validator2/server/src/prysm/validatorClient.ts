import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import rimraf from "rimraf";
import dargs from "dargs";
import { getLogger } from "../logs";
import { ValidatorPaths } from "./keystoreManager";
import { Supervisor, getRandomToken, ensureDirFromFilePath } from "../utils";
import {
  PRYSM_BINARY,
  PRYSM_VERBOSITY,
  PRYSM_EXTRA_OPTS,
  PRYSM_LOG_FILE,
  PRYSM_DATA_DIR,
  PRYSM_WALLET_DIR,
  PRYSM_WALLET_PASSWORD_PATH,
  GRAFFITI,
  PRYSM_VALIDATOR_APIRUL
} from "../params";

const binaryLogger = getLogger({ location: "prysm" });
const keyMgrLogger = getLogger({ location: "prysm keystore manager" });

// Prysm does not want the protocol in the beacon URL
const beaconRpcProviderPrysm = PRYSM_VALIDATOR_APIRUL.replace(
  /^https?:\/\//,
  ""
);

export const prysmBinary = new Supervisor(
  {
    command: PRYSM_BINARY,
    options: {
      medalla: true,
      "monitoring-host": "0.0.0.0",
      "beacon-rpc-provider": beaconRpcProviderPrysm,
      datadir: PRYSM_DATA_DIR,
      "wallet-dir": PRYSM_WALLET_DIR,
      "wallet-password-file": PRYSM_WALLET_PASSWORD_PATH,
      verbosity: PRYSM_VERBOSITY,
      "log-file": PRYSM_LOG_FILE,
      "accept-terms-of-use": true,
      ...(GRAFFITI ? { graffiti: GRAFFITI } : {}), // Ignore if empty
      // dargs extra options
      _: [PRYSM_EXTRA_OPTS]
    },
    // No typing necessary, Supervisor instance makes sure it's correct
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    dynamicOptions: () => ({
      "beacon-rpc-provider": beaconRpcProviderPrysm
    })
  },
  {
    timeoutKill: 10 * 1000,
    restartWait: 1000,
    resolveStartOnData: true,
    logger: binaryLogger
  }
);

/**
 * Prysm uses the validator binary to handle the import of keystores
 * The resulting structure is not relevant and can be completely
 * deleted by just removing the wallet directory
 */
export const prysmKeystoreManager = {
  async hasKeystores(): Promise<boolean> {
    return fs.existsSync(PRYSM_WALLET_DIR);

    // TODO: Use a better way
    // Note: `accounts-v2 list` outputs a too verbose output, can't use
    // [2020-08-06 21:57:14]  INFO accounts-v2: (wallet directory) /prysm/.eth2validators/primary
    // (keymanager kind) non-HD wallet

    // Showing 1 validator account
    // View the eth1 deposit transaction data for your accounts by running `validator accounts-v2 list --show-deposit-data

    // Account 0 | shortly-vast-gibbon
    // [validating public key] 0xb709108cf222c87d64526c393d872961f647f438b483365c14e5c0a26d08862cf06d10e630a71816c1920cb8ac699260

    // const { stdout, stderr } = await promisify(exec)(
    //   [
    //     PRYSM_BINARY,
    //     "accounts-v2",
    //     "list",
    //     ...dargs({
    //       "wallet-dir": PRYSM_WALLET_DIR,
    //       "wallet-password-file": PRYSM_WALLET_PASSWORD_PATH
    //     })
    //   ].join(" ")
    // );
  },

  /**
   * ```
   * ./prysm.sh validator accounts import
   *   --wallet-dir /prysm/.eth2validators/primary
   *   --wallet-password-file /prysm/.eth2validators/primary.pass
   *   --keys-dir prysm-import-0x94a1c0901b79b323ba4245bccf8ee50ac2ba0897558ac6811b917e0384a8a8159e1a1d6052534479dc5343af302c3863DIZ2b1
   *   --account-password-file /validators/secrets/0x94a1c0901b79b323ba4245bccf8ee50ac2ba0897558ac6811b917e0384a8a8159e1a1d6052534479dc5343af302c3863
   *   --accept-terms-of-use
   * ```
   * [validator-v1.0.0-alpha.29-linux-amd64]
   */
  async importKeystores(validatorsPaths: ValidatorPaths[]): Promise<void> {
    if (!fs.existsSync(PRYSM_WALLET_PASSWORD_PATH)) {
      ensureDirFromFilePath(PRYSM_WALLET_PASSWORD_PATH);
      fs.writeFileSync(PRYSM_WALLET_PASSWORD_PATH, getPrysmPassword());
      keyMgrLogger.info(`Wrote wallet password: ${PRYSM_WALLET_PASSWORD_PATH}`);
    }

    // Necessary to create a wallet?

    for (const { pubkey, keystorePath, secretPath } of validatorsPaths) {
      // Prysm expects keystores to have the eth2-cli name format
      // keystore-m_12381_3600_0_0_0-1595959302
      const tmpKeystoreDir = fs.mkdtempSync(`prysm-import-${pubkey}`);
      const unixSec = Math.floor(Date.now() / 1000);
      const eth2CliName = `keystore-m_12381_3600_0_0_0-${unixSec}.json`;
      const tmpKeystorePath = path.join(tmpKeystoreDir, eth2CliName);
      fs.copyFileSync(keystorePath, tmpKeystorePath);

      // This command will only import 1 account MAX, so it's okay to use exec
      // The output will never be too long and it will last for < 20 sec
      const { stdout, stderr } = await promisify(exec)(
        [
          PRYSM_BINARY,
          "accounts",
          "import",
          ...dargs({
            "wallet-dir": PRYSM_WALLET_DIR,
            "wallet-password-file": PRYSM_WALLET_PASSWORD_PATH,
            // Directory containing multiple keystores WITH THE SAME PASSWORD
            "keys-dir": tmpKeystoreDir,
            "account-password-file": secretPath,
            "accept-terms-of-use": true
          })
        ].join(" ")
      );

      if (stdout.includes("imported 0 accounts"))
        throw Error(
          `cmd 'prysm accounts import' failed to import keystore from ${tmpKeystoreDir}: ${stdout}`
        );

      await promisify(rimraf)(tmpKeystoreDir);

      keyMgrLogger.info(
        `Imported ${pubkey} keystore to wallet ${PRYSM_WALLET_DIR}`,
        { stdout, stderr }
      );
    }
  },

  async deleteKeystores(): Promise<void> {
    await promisify(rimraf)(PRYSM_WALLET_DIR);
    keyMgrLogger.info(`Deleted all files in ${PRYSM_WALLET_DIR}`);
  }
};

/**
 * Return a password compatible with Prysm requirements
 * - more than 8 characters
 * - must contain 1 number
 * - must contain 1 special character
 */
function getPrysmPassword(): string {
  return getRandomToken(32) + ".";
}
