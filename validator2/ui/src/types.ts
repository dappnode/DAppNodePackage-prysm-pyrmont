export interface RequestStatus<R = unknown> {
  result?: R;
  loading?: boolean;
  error?: string | Error;
}
