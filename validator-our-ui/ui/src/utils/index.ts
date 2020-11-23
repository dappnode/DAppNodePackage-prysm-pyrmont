/**
 * Props to be passed to a JSX <a> element to open a new tab
 * The purpose of this utility is to centralize this props.
 * To disable the newTab openning for certain <a> from the whole project, edit this file
 *
 * It converts:
 *   <a href={url} rel="noopener noreferrer" target="_blank">
 * Into:
 *   <a href={url} {...newTabProps}>
 */
export const newTabProps = { rel: "noopener noreferrer", target: "_blank" };

/**
 * Use to disable a styling
 */
export const noAStyle = { color: "inherit", textDecoration: "none" };

/**
 * Joins multiple url parts safely
 * - Does not break the protocol double slash //
 * - Cleans double slashes at any point
 * @param args ("http://ipfs.io", "ipfs", "Qm")
 * @return "http://ipfs.io/ipfs/Qm"
 */
export function urlJoin(...args: string[]): string {
  return (
    args
      .join("/")
      .replace(/([^:]\/)\/+/g, "$1")
      // Duplicate slashes in the front
      .replace(/^(\/)+/, "/")
  );
}

/**
 * Format an ETH value to a reasonable amount of decimal places
 * @param value
 */
export function formatEth(
  value: string | number | null,
  fractionDigits = 3
): number | string {
  if (value === null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  return +num.toFixed(fractionDigits);
}
