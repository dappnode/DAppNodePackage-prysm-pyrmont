import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, GridSize } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },
  spacing: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
}));

export const LayoutItem: React.FC<{
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  noPaper?: boolean;
  spacing?: boolean;
}> = function LayoutItem({ noPaper, spacing, children, ...props }) {
  const classes = useStyles();
  if (noPaper)
    return (
      <Grid
        item
        xs={12}
        className={clsx(spacing && classes.spacing)}
        {...props}
      >
        {children}
      </Grid>
    );
  else
    return (
      <Grid item xs={12} {...props}>
        <Paper className={clsx(classes.paper, spacing && classes.spacing)}>
          {children}
        </Paper>
      </Grid>
    );
};
