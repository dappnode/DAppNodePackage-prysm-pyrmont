import {
  eth1Faucet,
  eth1TxViewer,
  beaconAccountViewer,
  validatorCost,
} from "common/params";

// Static params

export const PUBLIC_PACKAGES_APIURL = "http://my.dappnode/public-packages";
export const DNP_NAME_DMS = "dms.dnp.dappnode.eth";
export const PACKAGE_DNP_URL = "http://my.dappnode/#/packages/";
export const EF_LAUNCHPAD_URL = "https://medalla.launchpad.ethereum.org/";

// Modifiable params

type Params = { [key: string]: string | number };
const localStorageParams = "params";
const defaultParams = {
  eth1Faucet,
  eth1TxViewer,
  beaconAccountViewer,
  validatorCost,
};

export default {
  eth1Faucet,
  eth1TxViewer,
  beaconAccountViewer,
  validatorCost,
  ...getLocalAndUrlParams(),
};

/**
 * Safe parse local params stored in local storage
 */
function parseLocalParams(): Params {
  try {
    const raw = localStorage.getItem(localStorageParams);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Error parsing local params", e);
    return {};
  }
}

/**
 * Read params from local storage + URL search params
 * Store the result in local storage for peristance
 */
function getLocalAndUrlParams(): Params {
  const searchParams = new URLSearchParams(window.location.search);
  const newParams: Params = {};
  for (const key of Object.keys(defaultParams)) {
    const value = searchParams.get(key);
    if (value) {
      newParams[key] = value;
      console.log(`Set local param ${key} to ${value}`);
    }
  }
  const prevParams = parseLocalParams();
  const _params = { ...prevParams, ...newParams };
  localStorage.setItem(localStorageParams, JSON.stringify(_params));
  return _params;
}
