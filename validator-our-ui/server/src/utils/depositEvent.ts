import { DepositEvent } from "../../common";
import { logs } from "../logs";
import { ethers } from "ethers";

const amount32EthLittleEdian = "0x0040597307000000";

/**
 * Fetches the highest amount from various deposit events
 * @param depositEvents
 */
export function computeExpectedBalance(
  depositEvents: DepositEvent[]
): number | null {
  if (depositEvents.length === 0) return null;
  const expectedBalances = depositEvents.map(event => {
    try {
      return parseDepositAmount(event.amount);
    } catch (e) {
      logs.warn(`Error parsing deposit amount`, e);
      return event.amount === amount32EthLittleEdian ? 32 : 0;
    }
  });

  return expectedBalances.reduce((max, b) => (max > b ? max : b), 0);
}

function parseDepositAmount(amount: string): number {
  const balanceHex9Decimals = "0x" + changeEndianness(amount.replace("0x", ""));
  return parseFloat(
    ethers.utils.formatUnits(new ethers.utils.BigNumber(balanceHex9Decimals), 9)
  );
}

function changeEndianness(string: string): string {
  const result = [];
  let len = string.length - 2;
  while (len >= 0) {
    result.push(string.substr(len, 2));
    len -= 2;
  }
  return result.join("");
}
