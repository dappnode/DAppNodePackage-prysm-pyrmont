import React, { useState } from "react";
import * as auth from "api/auth";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { FooterNote } from "./FooterNote";
import { InputPassword } from "./InputPassword";
import { RequestStatus } from "types";
import { ErrorView } from "./ErrorView";
import { Alert } from "@material-ui/lab";
import { packageAdminConfigPage } from "common/params";
import { newTabProps } from "utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  yMargin: {
    margin: theme.spacing(3, 0),
  },
}));

export function SignIn({
  onSignIn,
  isOffline,
}: {
  onSignIn: () => void;
  isOffline?: boolean;
}) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<RequestStatus<string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const classes = useStyles();

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      // Do signIn
      setStatus({ loading: true });
      const result = await auth.login(input);
      setStatus({ result });
      console.log("Logged in", result);
    } catch (e) {
      console.error(e);
      setStatus({ error: e.message });
    } finally {
      onSignIn();
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={signIn}>
          <InputPassword
            password={input}
            setPassword={setInput}
            error={Boolean(status.error)}
          />

          {status.error && <ErrorView error={status.error} />}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={status.loading}
          >
            Sign In
          </Button>
        </form>
      </div>

      {showForgotPassword ? (
        <Alert severity="info" className={classes.yMargin}>
          If you are an admin go to this{" "}
          <Link href={packageAdminConfigPage} {...newTabProps}>
            package config page
          </Link>{" "}
          to see or change its PASSWORD.
        </Alert>
      ) : (
        <Link onClick={() => setShowForgotPassword(true)} variant="body2">
          Forgot password?
        </Link>
      )}

      {isOffline && (
        <Alert severity="error" className={classes.yMargin}>
          Cannot connect with the server - are you online?
        </Alert>
      )}

      <Box mt={8}>
        <FooterNote />
      </Box>
    </Container>
  );
}
