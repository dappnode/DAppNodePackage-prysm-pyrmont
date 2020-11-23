import { parseResponse } from "./utils";
import * as paths from "./paths";

export async function loginStatus(): Promise<string> {
  const res = await fetch(paths.login);
  return await parseResponse<string>(res);
}

export async function login(password: string) {
  const res = await fetch(paths.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return await parseResponse<string>(res);
}

export async function logout() {
  const res = await fetch(paths.logout);
  return await parseResponse<string>(res);
}
