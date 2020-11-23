import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import params from "params";
import { newTabProps, urlJoin } from "utils";

const useStyles = makeStyles((theme) => ({
  centerLink: {
    display: "flex",
    alignItems: "center",
  },
  linkIcon: {
    marginLeft: theme.spacing(0.5),
    display: "flex",
    fontSize: "135%",
  },
}));

export function PublicKeyView({ publicKey }: { publicKey: string }) {
  const classes = useStyles();
  const shortHex = publicKey.substr(0, 6) + "..." + publicKey.substr(-4);
  return (
    <div className={classes.centerLink}>
      {shortHex}
      <Link
        className={classes.linkIcon}
        href={urlJoin(params.beaconAccountViewer, publicKey)}
        {...newTabProps}
      >
        <LaunchIcon fontSize="inherit" />
      </Link>
    </div>
  );
}
