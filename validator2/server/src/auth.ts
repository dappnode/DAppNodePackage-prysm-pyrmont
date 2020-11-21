import express from "express";
import { HttpError } from "./utils";
import { logs } from "./logs";
import { adminPassword, disablePassword } from "./params";

if (!adminPassword) logs.warn(`Warning! No password set, anyone can access`);
if (disablePassword) logs.warn(`Warning! PASSWORD_DISABLED, anyone can access`);

export function onlyAdmin(req: express.Request): string {
  if (!adminPassword || disablePassword) return "PASSWORD_DISABLED";

  if (!req.session) throw new HttpError("No session");
  if (!req.header("cookie")) throw new HttpError("No cookie", 400);

  const isAdmin = req.session.isAdmin;
  if (!isAdmin) throw new HttpError("Forbidden", 403);
  return req.session.id;
}

export function loginAdmin(req: express.Request): string {
  if (!req.session) throw new HttpError("No session");

  const password = req.body.password;
  if (!password) throw new HttpError("Missing credentials");
  if (password !== adminPassword) throw new HttpError("Wrong password");

  req.session.isAdmin = true;
  return req.session.id;
}

export async function logoutAdmin(req: express.Request): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!req.session) return reject(new HttpError("No session"));
    req.session.destroy(err => (err ? reject(err) : resolve()));
  });
}
