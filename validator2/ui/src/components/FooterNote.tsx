import React from "react";
import { Link, Typography } from "@material-ui/core";

export function FooterNote() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"GPLv3 - "}
      <Link color="inherit" href="https://dappnode.io/">
        DAppNode
      </Link>{" "}
      {"2020."}
    </Typography>
  );
}
