import { urlJoin } from "utils";

const baseUrl = process.env.REACT_APP_API_URL || "/";

export const login = urlJoin(baseUrl, "/login");
export const logout = urlJoin(baseUrl, "/logout");
export const rpc = urlJoin(baseUrl, "/rpc");
export const backup = urlJoin(baseUrl, "/backup");
export const ping = urlJoin(baseUrl, "/ping");

console.log(`API base urls: ${baseUrl}`, { login, logout, rpc });
