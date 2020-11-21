import React from "react";
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@material-ui/core";
import { EF_LAUNCHPAD_URL } from "params";
import { noAStyle, newTabProps } from "utils";
import { Link } from "react-router-dom";
import { paths } from "paths";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
  importWarning: {
    marginTop: theme.spacing(2),
  },
  importValidators: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: theme.spacing(4),
  },
}));

export function OnboardingDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Prysm Medalla validator onboarding
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Typography>
          Import you validator(s) keystores. You can generate new ones on the
          official Ethereum Foundation Eth2.0 Launchpad. This is the recommended
          and most secure way of generating these keystores.
        </Typography>

        <Alert severity="warning" className={classes.importWarning}>
          When using the Eth2.0 Launchpad be extremely careful with phishing
          attacks
        </Alert>

        <div className={classes.importValidators}>
          <a href={EF_LAUNCHPAD_URL} style={noAStyle} {...newTabProps}>
            <Button variant="outlined" color="primary">
              Generate
              <br />
              validators
            </Button>
          </a>
          <Link to={paths.validatorsImport} style={noAStyle}>
            <Button variant="contained" color="primary">
              Import
              <br />
              validators
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
