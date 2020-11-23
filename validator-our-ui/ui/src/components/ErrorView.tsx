import React from "react";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pre: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },
  error: {
    color: theme.palette.secondary.main,
  },
}));

function parseError(error: Error | string) {
  if (error instanceof Error)
    return { message: error.message, detail: error.stack };
  if (typeof error === "string") return { message: error };
  return { message: JSON.stringify(error), detail: "" };
}

export function ErrorView({ error }: { error: Error | string }) {
  const classes = useStyles();
  const { message, detail } = parseError(error);

  return (
    <Box color="error" className={classes.error}>
      <details>
        <summary>{message.split("\n")[0]}</summary>
        <pre className={classes.pre}>{detail}</pre>
      </details>
    </Box>
  );
}
