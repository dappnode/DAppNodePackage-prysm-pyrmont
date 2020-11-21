import React from "react";
import { Typography } from "@material-ui/core";
import { Title } from "./Title";
import { NodeStats, AppSettings } from "common";

export function NodeStatsView({
  nodeStats,
  appSettings,
}: {
  nodeStats: NodeStats;
  appSettings?: AppSettings;
}) {
  return (
    <>
      <Title>Node stats</Title>
      <Typography>
        Current slot:{" "}
        <strong>{nodeStats.syncing ? nodeStats.syncing.head_slot : "?"}</strong>{" "}
        {nodeStats.syncing
          ? parseInt(nodeStats.syncing.sync_distance) > 0
            ? "(syncing)"
            : "(synced)"
          : ""}
      </Typography>
      <Typography>
        Peers: <strong>{nodeStats.peers ? nodeStats.peers.length : "?"}</strong>
      </Typography>
      <Typography>
        Node: <strong>{appSettings?.beaconProvider}</strong>
      </Typography>
    </>
  );
}
