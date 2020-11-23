import fs from "fs";
import path from "path";

/**
 * Make sure a directory path exists
 * @param dirPath "/path/to/dir"
 */
export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Make sure the directory containing this file path exists
 * @param filePath "/path/to/dir/file.ext"
 */
export function ensureDirFromFilePath(filePath: string): void {
  ensureDir(path.parse(filePath).dir);
}
