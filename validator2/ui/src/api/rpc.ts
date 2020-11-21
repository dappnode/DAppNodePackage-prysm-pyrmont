import { mapValues } from "lodash";
import useSWR, { responseInterface } from "swr";
import { routesData, Routes, ResolvedType } from "../common/routes";
import * as paths from "./paths";
import { parseRpcResponse } from "./utils";

/**
 * Call a RPC route through an autobahn session
 * @param apiUrl
 * @param route "restartPackage"
 * @param args ["bitcoin.dnp.dappnode.eth"]
 */
export async function callRoute(route: string, args: any[]) {
  const res = await fetch(paths.rpc, {
    method: "post",
    body: JSON.stringify({ method: route, params: args }),
    headers: { "Content-Type": "application/json" },
  });
  return parseRpcResponse<any>(res);
}

export const api: Routes = mapValues(
  routesData,
  (data, route) => (...args: any[]) => callRoute(route, args)
);

/**
 * Unique key per route domain to make SWR cache work
 */
const getKey = (route: string, args: any[]) =>
  route + (args.length > 0 ? JSON.stringify(args) : "");

export const useApi: {
  [K in keyof Routes]: (
    ...args: Parameters<Routes[K]>
  ) => responseInterface<ResolvedType<Routes[K]>, Error>;
} = mapValues(api, (handler, route) => {
  return function (...args: any[]) {
    const fetcher: (...args: any[]) => Promise<any> = handler;
    return useSWR(getKey(route, args), () => fetcher(...args), {
      refreshInterval: 2000,
    });
  };
});
