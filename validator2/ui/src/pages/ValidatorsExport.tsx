import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import * as apiPaths from "api/paths";
import { LayoutItem } from "components/LayoutItem";
import { Title, TitlePage } from "components/Title";

export function ValidatorsExport() {
  return (
    <>
      <TitlePage>Export validators</TitlePage>
      <LayoutItem>
        <Title>Export validators</Title>
        <Typography color="textSecondary">
          Export all local validators keystores a single zip file. They are
          encrypted with their original import password.
        </Typography>

        <Box mt={3} mb={1}>
          <Button variant="contained" color="primary" href={apiPaths.backup}>
            Backup
          </Button>
        </Box>
      </LayoutItem>
    </>
  );
}
