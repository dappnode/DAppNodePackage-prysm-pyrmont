import fs from "fs";
import path from "path";
import { ValidatorFiles } from "../../common";
import { VALIDATOR_KEYSTORES_DIR, VALIDATOR_SECRETS_DIR } from "../params";
import { ensureDir, ensureDirFromFilePath } from "../utils";

export interface ValidatorPaths {
  dirPath: string;
  keystorePath: string;
  secretPath: string;
  pubkey: string;
}

type ValidatorSafeFiles = Pick<ValidatorFiles, "pubkey" | "keystore">;

interface GeneralKeystoreManager {
  importKeystores(keystore: ValidatorFiles[]): Promise<void>;
  readKeystores(): Promise<ValidatorSafeFiles[]>;
  getValidatorsPaths(): ValidatorPaths[];
}

export const keystoreManager: GeneralKeystoreManager = {
  async importKeystores(validatorsFiles: ValidatorFiles[]): Promise<void> {
    ensureDir(VALIDATOR_SECRETS_DIR);
    for (const { pubkey, keystore, passphrase } of validatorsFiles) {
      const paths = getPaths({ pubkey });
      ensureDirFromFilePath(paths.keystorePath);
      await fs.promises.writeFile(paths.keystorePath, JSON.stringify(keystore));
      await fs.promises.writeFile(paths.secretPath, passphrase);
    }
  },

  async readKeystores(): Promise<ValidatorSafeFiles[]> {
    const validatorsFiles: ValidatorSafeFiles[] = [];
    for (const { keystorePath, pubkey } of this.getValidatorsPaths()) {
      validatorsFiles.push({
        pubkey,
        keystore: JSON.parse(await fs.promises.readFile(keystorePath, "utf8"))
      });
    }
    return validatorsFiles;
  },

  getValidatorsPaths(): ValidatorPaths[] {
    try {
      return fs
        .readdirSync(VALIDATOR_KEYSTORES_DIR)
        .map(pubkey => getPaths({ pubkey }));
    } catch (e) {
      if (e.code === "ENOENT") return [];
      else throw e;
    }
  }
};

function getPaths({ pubkey }: { pubkey: string }): ValidatorPaths {
  if (!pubkey.startsWith("0x")) pubkey = `0x${pubkey}`;
  const dirPath = path.join(VALIDATOR_KEYSTORES_DIR, pubkey);
  return {
    pubkey,
    dirPath,
    keystorePath: path.join(dirPath, "voting-keystore.json"),
    secretPath: path.join(VALIDATOR_SECRETS_DIR, pubkey)
  };
}
