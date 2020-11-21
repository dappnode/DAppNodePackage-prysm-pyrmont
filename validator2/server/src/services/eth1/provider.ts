import { ethers } from "ethers";
import { eth1Web3Url } from "../../params";

let provider: ethers.providers.JsonRpcProvider;

export function getEth1Provider(): ethers.providers.JsonRpcProvider {
  if (!provider) provider = new ethers.providers.JsonRpcProvider(eth1Web3Url);
  return provider;
}
