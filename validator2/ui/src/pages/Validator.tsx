import React from "react";
import { useApi } from "api/rpc";
import { Typography, Box, Button } from "@material-ui/core";
import { LayoutItem } from "components/LayoutItem";
import { RouteComponentProps } from "react-router";
import { Title, TitlePage } from "components/Title";
import { PublicKeyView } from "components/PublicKeyView";
import { formatEth } from "utils";

export function Validator({ match }: RouteComponentProps<{ pubkey: string }>) {
  const pubkey = match.params.pubkey;
  const validators = useApi.getValidators();

  if (validators.data) {
    const validator = validators.data.find((v) => v.publicKey === pubkey);
    if (!validator) return <TitlePage>Validator {pubkey} not found</TitlePage>;

    return (
      <>
        <LayoutItem sm={6}>
          <Title>Validator</Title>
          <Box style={{ fontSize: "1.5rem" }}>
            <PublicKeyView publicKey={validator.publicKey} />
          </Box>
        </LayoutItem>

        <LayoutItem sm={6}>
          <Title>Validator stats</Title>
          <Typography>
            Status: <strong>{validator.status}</strong>{" "}
          </Typography>
          <Typography>
            Balance: <strong>{formatEth(validator.balance.eth)}</strong>
          </Typography>
        </LayoutItem>

        <LayoutItem>
          <Title>Validator actions</Title>

          <Box my={2}>
            <Typography>Export validator</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {}}
              disabled={false}
            >
              Export validator
            </Button>
          </Box>

          <Box my={2}>
            <Typography>Exit validator</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {}}
              disabled={false}
            >
              Exit validator
            </Button>
          </Box>

          <Box my={2}>
            <Typography>Re-deposit validator</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {}}
              disabled={false}
            >
              Re-deposit validator
            </Button>
          </Box>
        </LayoutItem>
      </>
    );
  }
  return null;
}
