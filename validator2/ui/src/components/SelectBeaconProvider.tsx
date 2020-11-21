import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  makeStyles,
  Button,
  Box,
} from "@material-ui/core";
import { api } from "api/rpc";
import { RequestStatus } from "types";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { newTabProps, urlJoin, noAStyle } from "utils";
import { shortNameCapitalized } from "utils/format";
import { DnpInstalledStatus, BeaconProviderName, AppSettings } from "common";
import { PACKAGE_DNP_URL } from "params";
import { Alert } from "@material-ui/lab";

const runningState = "running";
const beaconProviderOptions: {
  value: BeaconProviderName;
  label: string;
}[] = [
  { value: "lighthouse", label: "Local DAppNode Lighthouse" },
  { value: "prysm", label: "Local DAppNode Prysm" },
];

const useStyles = makeStyles((theme) => ({
  chipArray: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  selectDescription: {
    flexGrow: 1,
  },
  selectFormControl: {
    marginTop: theme.spacing(2),
  },
  bottomContainer: {
    marginTop: theme.spacing(2),
    "& > div:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
}));

export function SelectBeaconProvider({
  appSettings,
  onSuccess,
}: {
  appSettings: AppSettings;
  onSuccess: () => void;
}) {
  const [beaconProvider, setBeaconProvider] = useState<BeaconProviderName>();
  const [reqStatus, setReqStatus] = useState<RequestStatus>({});

  useEffect(() => {
    const serverOption = beaconProviderOptions.find(
      (o) => o.value === appSettings.beaconProvider
    );
    if (serverOption) setBeaconProvider(serverOption.value);
  }, [appSettings.beaconProvider]);

  const hasChanged = beaconProvider !== appSettings.beaconProvider;
  const currentDnp = beaconProvider && appSettings.beaconDnps[beaconProvider];
  const dnpNotReady =
    currentDnp?.status === "not-installed" ||
    (currentDnp?.status === "installed" && currentDnp.state !== runningState);

  async function changeBeaconProvider() {
    if (!hasChanged) return;
    try {
      setReqStatus({ loading: true });
      if (!beaconProvider) throw Error("no beaconProvider");
      await api.setBeaconProvider(beaconProvider);
      setReqStatus({ result: "" });
      onSuccess();
    } catch (e) {
      console.error("Error on switchValidatorClient", e);
      setReqStatus({ error: e });
    }
  }

  const classes = useStyles();

  return (
    <>
      <FormControl variant="outlined" className={classes.selectFormControl}>
        <Select
          value={beaconProvider || ""}
          onChange={(e) =>
            setBeaconProvider(e.target.value as BeaconProviderName)
          }
        >
          {beaconProviderOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {currentDnp && (
        <Box mt={2}>
          <BeaconNodeDnpStatus currentDnp={currentDnp} />
        </Box>
      )}

      <div className={classes.bottomContainer}>
        {reqStatus.error && <ErrorView error={reqStatus.error} />}
        {reqStatus.loading && (
          <LoadingView
            steps={[
              "Stopping current client",
              "Migrating files",
              "Starting new client",
            ]}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={changeBeaconProvider}
          disabled={
            !beaconProvider || !hasChanged || dnpNotReady || reqStatus.loading
          }
        >
          Apply changes
        </Button>
      </div>
    </>
  );
}

function BeaconNodeDnpStatus({
  currentDnp,
}: {
  currentDnp: DnpInstalledStatus;
}) {
  const dnpName = currentDnp.name;
  const dnpNamePretty = shortNameCapitalized(currentDnp.name);

  switch (currentDnp.status) {
    case "installed":
      if (currentDnp.state === runningState) {
        return (
          <Alert severity="success">
            Package {dnpNamePretty} is installed and running
          </Alert>
        );
      } else {
        return (
          <Alert
            severity="error"
            action={
              <a
                href={urlJoin(PACKAGE_DNP_URL, dnpName)}
                {...newTabProps}
                style={noAStyle}
              >
                <Button color="inherit">RESTART</Button>
              </a>
            }
          >
            Package {dnpNamePretty} is not running. Review its status and
            restart it.
          </Alert>
        );
      }

    case "not-installed":
      return (
        <Alert
          severity="warning"
          action={
            <a href={currentDnp.installUrl} {...newTabProps} style={noAStyle}>
              <Button color="inherit">INSTALL</Button>
            </a>
          }
        >
          Package {dnpNamePretty} is not installed. Install it to continue.
        </Alert>
      );

    case "fetch-error":
      return <ErrorView error={currentDnp.error} />;

    default:
      return null;
  }
}
