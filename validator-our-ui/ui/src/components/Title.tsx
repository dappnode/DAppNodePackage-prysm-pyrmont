import React from "react";
import { Typography } from "@material-ui/core";
import { LayoutItem } from "./LayoutItem";

export const Title: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <Typography
    className={className}
    component="h2"
    variant="h6"
    color="primary"
    gutterBottom
  >
    {children}
  </Typography>
);

export const TitlePage: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <LayoutItem noPaper>
    <Typography
      className={className}
      component="h2"
      variant="h5"
      color="textSecondary"
      gutterBottom
    >
      {children}
    </Typography>
  </LayoutItem>
);
