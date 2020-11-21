import React, { useState } from "react";
import { orderBy } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  Typography,
  Box,
  TableSortLabel,
} from "@material-ui/core";
import { Title } from "./Title";
import { ValidatorStats } from "../common/types";
import { HelpText } from "components/HelpText";
import { prysmStatusDescription } from "text";
import { PublicKeyView } from "./PublicKeyView";
import { DepositEventsView } from "./Eth1TransactionView";
import { formatEth, noAStyle } from "utils";
import { LoadingView } from "./LoadingView";
import { Link } from "react-router-dom";
import { paths } from "paths";

const maxItems = 10;
type SortOption = "index" | "blockNumber" | "status" | "balance";
type SortOrder = "asc" | "desc";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
  },
  centerLink: {
    display: "flex",
    alignItems: "center",
  },
  total: {
    color: theme.palette.text.secondary,
  },
  linkIcon: {
    marginLeft: theme.spacing(0.5),
    display: "flex",
    fontSize: "1.2rem",
  },
  noValidatorsContainer: {
    textAlign: "center",
    margin: theme.spacing(6),
  },
  noValidators: {
    fontSize: "0.85rem",
  },
}));

export function ValidatorStatsTable({
  validators,
  loading,
}: {
  validators: ValidatorStats[];
  loading: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const [sortProperty, setSortProperty] = useState<SortOption>("index");
  const [sortAsc, setSortAsc] = useState(false);
  const direction: SortOrder = sortAsc ? "asc" : "desc";
  const validatorsSorted = orderBy(
    validators,
    compareValidatorsBy(sortProperty),
    direction
  );

  // Limit the amount of items to show at once >1000 can crash the page
  const validatorsToShow = showAll
    ? validatorsSorted
    : validatorsSorted.slice(0, 10);

  function onHeaderClick(option?: SortOption) {
    if (!option) return;
    if (option === sortProperty) setSortAsc((x) => !x);
    else setSortProperty(option);
  }

  const classes = useStyles();

  const headers: {
    text: string;
    option?: SortOption;
    align?: "right";
    helpTable?: {
      name: string;
      text: string;
    }[];
  }[] = [
    { text: "#", option: "index" },
    { text: "PubKey" },
    { text: "Deposit", option: "blockNumber" },
    { text: "Status", option: "status" },
    { text: "Balance", option: "balance", align: "right" },
  ];

  return (
    <React.Fragment>
      <Title className={classes.title}>
        <span className={classes.centerLink}>
          Validator accounts <HelpText table={prysmStatusDescription} />
        </span>
        {validators.length > 1 && (
          <span className={classes.total}>{validators.length} total</span>
        )}
      </Title>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map(({ text, option, align, helpTable }) => (
                <TableCell key={text} align={align}>
                  {option ? (
                    <TableSortLabel
                      active={sortProperty === option}
                      direction={direction}
                      // style={alignRight ? { justifyContent: "flex-end" } : {}}
                      onClick={() => onHeaderClick(option)}
                    >
                      {text}
                    </TableSortLabel>
                  ) : (
                    text
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {validatorsToShow.map((validator) => (
              <TableRow key={validator.index}>
                <TableCell>{validator.index}</TableCell>
                <TableCell>
                  <PublicKeyView publicKey={validator.publicKey} />
                </TableCell>
                <TableCell>
                  <DepositEventsView depositEvents={validator.depositEvents} />
                </TableCell>
                <TableCell>{validator.status}</TableCell>
                <TableCell align="right">
                  {validator.balance.isExpected ? (
                    <i>{formatEth(validator.balance.eth)} (expected)</i>
                  ) : (
                    formatEth(validator.balance.eth)
                  )}
                </TableCell>
                {/* <TableCell align="right">
                  <Link to={paths.validatorByPubkey.to(validator.publicKey)}>
                    Manage
                  </Link>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {validatorsToShow.length === 0 ? (
        loading ? (
          <Box my={3}>
            <LoadingView
              steps={[
                "Fetching validator accounts",
                "Quering validator metrics",
              ]}
            />
          </Box>
        ) : (
          <Box className={classes.noValidatorsContainer}>
            <Typography
              variant="caption"
              className={classes.noValidators}
              color="textSecondary"
            >
              No validators
            </Typography>
            <Box mt={2} textAlign="center">
              <Link to={paths.validatorsImport} style={noAStyle}>
                <Button variant="contained" color="primary">
                  Import validators
                </Button>
              </Link>
            </Box>
          </Box>
        )
      ) : null}

      {/* Limit the amount of items to show at once >1000 can crash the page */}
      {validators.length > maxItems && (
        <Button
          className={classes.seeMore}
          color="primary"
          onClick={() => setShowAll(true)}
        >
          See all {validators.length} validators
        </Button>
      )}
    </React.Fragment>
  );
}

function compareValidatorsBy(
  sortOption: SortOption
): keyof ValidatorStats | ((validator: ValidatorStats) => any) {
  switch (sortOption) {
    case "index":
      return "index";
    case "blockNumber":
      return (v) => (Object.values(v.depositEvents)[0] || {}).blockNumber || 0;
    case "status":
      return "status";
    case "balance":
      return (v) => v.balance.eth || 0;
  }
}
