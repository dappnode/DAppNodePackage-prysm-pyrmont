/**
 * Parse a JSON non-RPC response of the server
 * @param res
 */
export async function parseResponse<R>(res: Response): Promise<R> {
  const body = await res.json();
  if (!body.success) throw Error(body.message);
  if (!res.ok) throw Error(res.statusText);
  return body.result;
}

export async function parseRpcResponse<R>(res: Response): Promise<R> {
  // Non-RPC reponse
  const body = await res.json();
  if (!res.ok) {
    throw Error(`${res.status} ${res.statusText} ${body.message || ""}`);
  }

  // RPC response are always code 200
  if (body.error)
    if (body.error.data)
      throw Error(body.error.message + "\n" + body.error.data);
    else throw Error(body.error.message);
  else return body.result;
}
