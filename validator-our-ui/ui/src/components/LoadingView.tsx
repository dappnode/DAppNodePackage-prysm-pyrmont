import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  progress: {
    display: "flex",
    flexWrap: "wrap",
    "& > div": {
      animationDuration: "5s",
    },
  },
}));

// MuiLinearProgress-keyframes-indeterminate1 4.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite

export function LoadingView({ steps }: { steps?: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const classes = useStyles();

  return (
    <Box my={2}>
      {steps && (
        <Typography color="textSecondary" gutterBottom align="center">
          {steps[index] || steps[steps.length - 1]}...
        </Typography>
      )}
      <LinearProgress className={classes.progress}></LinearProgress>
    </Box>
  );
}
