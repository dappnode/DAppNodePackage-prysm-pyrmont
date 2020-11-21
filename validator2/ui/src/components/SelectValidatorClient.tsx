import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  makeStyles,
  Box,
  Button,
} from "@material-ui/core";
import { api } from "api/rpc";
import { RequestStatus } from "types";
import { ValidatorClientName, AppSettings } from "common";
import { LoadingView } from "./LoadingView";
import { ErrorView } from "./ErrorView";
import { Alert } from "@material-ui/lab";

const validatorClientOptions: {
  value: ValidatorClientName;
  label: string;
}[] = [{ value: "prysm", label: "Prysm" }];

const useStyles = makeStyles((theme) => ({
  selectDescription: {
    flexGrow: 1,
  },
  selectFormControl: {
    marginTop: theme.spacing(2),
  },
}));

export function SelectValidatorClient({
  appSettings,
  onSuccess,
}: {
  appSettings: AppSettings;
  onSuccess: () => void;
}) {
  const [validatorClient, setValidatorClient] = useState<ValidatorClientName>();
  const [reqStatus, setReqStatus] = useState<RequestStatus>({});

  useEffect(() => {
    setValidatorClient(appSettings.validatorClient);
  }, [appSettings.validatorClient]);

  async function switchValidatorClient() {
    try {
      setReqStatus({ loading: true });
      if (!validatorClient) throw Error("no validatorClient");
      await api.switchValidatorClient(validatorClient);
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
          value={validatorClient || ""}
          onChange={(e) =>
            setValidatorClient(e.target.value as ValidatorClientName)
          }
        >
          {validatorClientOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {reqStatus.loading &&
        appSettings.validatorClient &&
        appSettings.validatorClient !== "prysm" &&
        validatorClient === "prysm" && (
          <Alert severity="warning">
            Importing validators may take a while (5-20 sec / validator).
          </Alert>
        )}

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

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={switchValidatorClient}
          disabled={
            !validatorClient ||
            appSettings.validatorClient === validatorClient ||
            reqStatus.loading
          }
        >
          Apply changes
        </Button>
      </Box>
    </>
  );
}
