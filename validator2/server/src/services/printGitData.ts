import fs from "fs";
import { gitDataPath } from "../params";
import { logs } from "../logs";

export function printGitData(): void {
  try {
    if (!gitDataPath) return logs.warn("gitDataPath not specified");
    const gitData = fs.readFileSync(gitDataPath, "utf8");
    logs.info("git data", gitData);
  } catch (e) {
    if (e.code === "ENOENT") logs.warn("gitData not found", gitDataPath || "");
    else logs.error("Error reading gitDataPath", e);
  }
}
