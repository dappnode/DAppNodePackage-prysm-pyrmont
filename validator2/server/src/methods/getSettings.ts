import memoizee from "memoizee";
import { AppSettings, DnpInstalledStatus } from "../../common";
import * as db from "../db";
import { getInstalledPackages } from "../services/installedPackages";
import {
  LIGHTHOUSE_DNPNAME,
  PRYSM_DNPNAME,
  PRYSM_INSTALL_URL,
  DMS_DNPNAME,
  DMS_INSTALL_LINK,
  LIGHTHOUSE_INSTALL_URL
} from "../params";

const getInstalledPackagesMem = memoizee(getInstalledPackages, {
  maxAge: 5 * 1000,
  promise: true
});

export async function getSettings(): Promise<AppSettings> {
  const getDnp = async ({
    name,
    installUrl
  }: {
    name: string;
    installUrl: string;
  }): Promise<DnpInstalledStatus> => {
    try {
      const dnps = await getInstalledPackagesMem();
      const dnp = dnps.find(dnp => dnp.name === name);
      if (dnp) return { ...dnp, status: "installed" };
      else return { name, installUrl, status: "not-installed" };
    } catch (e) {
      return { name, status: "fetch-error", error: e.message };
    }
  };

  return {
    validatorClient: db.server.validatorClient.get(),
    beaconProvider: db.server.beaconProvider.get(),
    beaconDnps: {
      lighthouse: await getDnp({
        name: LIGHTHOUSE_DNPNAME,
        installUrl: LIGHTHOUSE_INSTALL_URL
      }),
      prysm: await getDnp({
        name: PRYSM_DNPNAME,
        installUrl: PRYSM_INSTALL_URL
      })
    },
    dmsDnp: await getDnp({
      name: DMS_DNPNAME,
      installUrl: DMS_INSTALL_LINK
    })
  };
}
