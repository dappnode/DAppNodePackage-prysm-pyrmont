import React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";
import { Title } from "./Title";
import { AppSettings } from "common";
import { responseInterface } from "swr";
import { ValidatorBinaryStatus } from "./ValidatorBinaryStatus";
import { Link } from "react-router-dom";
import { paths } from "paths";
import { noAStyle } from "utils";

const useStyles = makeStyles((theme) => ({
  noClient: {
    textAlign: "center",
    margin: theme.spacing(3),
  },
}));

export function ValidatorClientView({
  appSettings,
}: {
  appSettings: responseInterface<AppSettings, Error>;
}) {
  const classes = useStyles();

  return (
    <>
      <Title>Validator client status</Title>
      {appSettings.data ? (
        appSettings.data.validatorClient ? (
          <>
            <Typography>
              Client: <strong>{appSettings.data.validatorClient}</strong>{" "}
            </Typography>
            <ValidatorBinaryStatus />
          </>
        ) : (
          <div className={classes.noClient}>
            <Link to={paths.settings} style={noAStyle}>
              <Button variant="contained" color="primary">
                Select validator client
              </Button>
            </Link>
          </div>
        )
      ) : null}
    </>
  );
}
