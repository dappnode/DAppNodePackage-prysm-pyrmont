import React, { useState, useEffect } from "react";
import { useApi } from "api/rpc";
import { Alert } from "@material-ui/lab";
import { LayoutItem } from "components/LayoutItem";
import { ValidatorStatsTable } from "components/ValidatorStatsTable";
import { NodeStatsView } from "components/NodeStats";
import { TotalBalance } from "components/TotalBalance";
import { OnboardingDialog } from "components/OnboardingDialog";
import { ValidatorClientView } from "components/ValidatorClientView";
import { parseIsSyncing } from "utils/syncing";

export function Home() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const validators = useApi.getValidators();
  const nodeStats = useApi.nodeStats();
  const appSettings = useApi.getSettings();

  const noValidators = validators.data && validators.data.length === 0;
  const noClientSelected =
    appSettings.data && !appSettings.data.validatorClient;
  const firstBoot = noValidators && noClientSelected;

  useEffect(() => {
    if (firstBoot) setOnboardingOpen(true);
  }, [firstBoot]);

  return (
    <>
      {parseIsSyncing(nodeStats.data?.syncing) && (
        <LayoutItem noPaper>
          <Alert severity="warning">
            Eth2 beacon node is still syncing. The validator can not perform its
            duties until it's fully synced
          </Alert>
        </LayoutItem>
      )}

      <LayoutItem sm={6}>
        <TotalBalance validators={validators.data || []} />
      </LayoutItem>
      {nodeStats.data && (
        <LayoutItem sm={6}>
          <NodeStatsView
            nodeStats={nodeStats.data}
            appSettings={appSettings.data}
          />
        </LayoutItem>
      )}

      <LayoutItem>
        <ValidatorClientView appSettings={appSettings} />
      </LayoutItem>

      <LayoutItem>
        <ValidatorStatsTable
          validators={validators.data || []}
          loading={!validators.data && validators.isValidating}
        />
      </LayoutItem>

      {appSettings.data && (
        <OnboardingDialog
          open={onboardingOpen}
          onClose={() => setOnboardingOpen(false)}
        ></OnboardingDialog>
      )}
    </>
  );
}
