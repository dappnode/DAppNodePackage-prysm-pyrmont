import { Response } from "node-fetch";

/**
 * Parse a node-fetch response providing more meaningful messages
 * if the body of an error response does not contain JSON
 */
export async function parseFetchJson<R>(res: Response): Promise<R> {
  const body = await res.text();
  if (!res.ok) throw Error(`${res.status} ${res.statusText}\n${body}`);
  try {
    return JSON.parse(body);
  } catch (e) {
    throw Error(`Error parsing request body: ${e.message}\n${body}`);
  }
}
