import { Supervisor } from "../../utils";
import { ChildProcessStatus } from "../../../common";
import { keystoreManager, ValidatorPaths } from "../keystoreManager";

export interface ClientKeystoreManager {
  importKeystores(validatorsPaths: ValidatorPaths[]): Promise<void>;
  deleteKeystores(): Promise<void>;
  hasKeystores(): Promise<boolean>;
}

export class ValidatorClient {
  private binary: Supervisor;
  private keystoreManager: ClientKeystoreManager;

  constructor(binary: Supervisor, keystoreManager: ClientKeystoreManager) {
    this.binary = binary;
    this.keystoreManager = keystoreManager;
  }

  /**
   * Grab validator keys and start process
   */
  async restart(options?: { reImportKeystores?: boolean }): Promise<void> {
    const validatorsPaths = keystoreManager.getValidatorsPaths();
    const clientHasKeystores = await this.keystoreManager.hasKeystores();

    if (validatorsPaths.length > 0) {
      if (options?.reImportKeystores) {
        await this.keystoreManager.deleteKeystores();
      }

      if (!clientHasKeystores) {
        await this.binary.kill();
        await this.keystoreManager.importKeystores(validatorsPaths);
      }

      await this.binary.restart();
    }
  }

  /**
   * Kill process and remove validator keys
   */
  async stop(): Promise<void> {
    await this.binary.kill();
    await this.keystoreManager.deleteKeystores();
  }

  /**
   * Get client status
   */
  async getStatus(): Promise<ChildProcessStatus | null> {
    return this.binary.getStatus();
  }
}
