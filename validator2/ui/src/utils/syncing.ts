import {SyncStatus} from "../common"

export function parseIsSyncing(syncing: SyncStatus | null | undefined): boolean {
  if (syncing === null || syncing === undefined) return false;
  return parseInt(syncing.sync_distance) > 0;
} 