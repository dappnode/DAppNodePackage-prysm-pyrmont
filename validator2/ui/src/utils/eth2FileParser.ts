import { Eth2Keystore, Eth2Deposit } from "common";

type Eth2File =
  | { type: "keystore"; keystore: Eth2Keystore }
  | { type: "deposit"; data: Eth2Deposit[] }
  | { type: "passphrase"; pubkey: string; passphrase: string };

export async function processEth2File(file: File): Promise<Eth2File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject(Error("file reading was aborted"));
    reader.onerror = () => reject(Error("file reading has failed"));
    reader.onload = () => {
      const dataStr = reader.result;
      if (typeof dataStr !== "string") {
        return reject(Error("Data not a string"));
      }
      try {
        let json: any;
        try {
          json = JSON.parse(dataStr);
        } catch (e) {
          // Assume it's plain string
          // Name should be the pubkey of the validator = 0x88f920bb56d76c68e0d983e9772e67d2ba4afadd5eb162a51f7fc62212c138e5611d99f98f834fce43f310295ca35eca
          const pubkey = file.name.replace("0x", "");
          if (isPubkey(pubkey)) {
            return resolve({
              type: "passphrase",
              pubkey,
              passphrase: dataStr,
            });
          }
        }

        if (isEth2Keystore(json))
          return resolve({
            type: "keystore",
            keystore: json,
          });

        if (isEth2Deposit(json))
          return resolve({
            type: "deposit",
            data: [json],
          });

        if (isEth2DepositArray(json))
          return resolve({
            type: "deposit",
            data: json,
          });

        throw Error("Unknown eth2 file type");
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });
}

function isEth2Keystore(json: Eth2Keystore): boolean {
  return Boolean(json.pubkey && json.crypto);
}

function isEth2Deposit(json: Eth2Deposit): boolean {
  return Boolean(json.pubkey && json.withdrawal_credentials);
}

function isEth2DepositArray(json: Eth2Deposit[]): boolean {
  return Array.isArray(json) && json.every(isEth2Deposit);
}

function isPubkey(s: string): boolean {
  return /^[A-Fa-f0-9]{96}$/.test(s);
}
