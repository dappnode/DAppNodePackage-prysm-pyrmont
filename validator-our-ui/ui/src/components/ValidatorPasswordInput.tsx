import React, { useState } from "react";
import { verifyPassword } from "@chainsafe/bls-keystore";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Box,
} from "@material-ui/core";
import { InputPassword } from "./InputPassword";
import { ErrorView } from "./ErrorView";
import { RequestStatus } from "types";
import { LoadingView } from "./LoadingView";
import { Eth2Keystore } from "common";

export function ValidatorPasswordInput({
  keystore,
  onValidPassword,
  buttonLabel,
}: {
  keystore: Eth2Keystore;
  onValidPassword: (passphrase: string) => void;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validateStatus, setValidateStatus] = useState<RequestStatus<true>>({});

  const errors: string[] = [];
  if (password && passwordConfirm && password !== passwordConfirm)
    errors.push("Password do not match");
  const hasErrors = errors.length > 0;

  async function onValidate() {
    try {
      setValidateStatus({ loading: true });
      const valid = await verifyPassword(keystore as any, password);
      if (!valid) throw Error("Invalid keystore password");
      setValidateStatus({ result: true });
      onValidPassword(password);
    } catch (e) {
      setValidateStatus({ error: e });
    }
  }

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        {buttonLabel || "Input password"}
      </Button>

      {open && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Validator keystore password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide this validator's keystore password to perform its duties
              in the validator client
            </DialogContentText>

            <Box my={1}>
              <InputPassword
                password={password}
                setPassword={setPassword}
                error={hasErrors}
              />
              <InputPassword
                name="Confirm"
                password={passwordConfirm}
                setPassword={setPasswordConfirm}
                error={hasErrors}
                id="password-confirm-toogle-show"
              />

              {errors.map((error, i) => (
                <Typography key={i} variant="body2" color="error">
                  {error}
                </Typography>
              ))}
            </Box>

            {validateStatus.loading && (
              <LoadingView
                steps={["Validating keystore password"]}
              ></LoadingView>
            )}
            {validateStatus.error && <ErrorView error={validateStatus.error} />}

            <Box mt={3} mb={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={hasErrors || validateStatus.loading}
                onClick={onValidate}
              >
                Validate
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
