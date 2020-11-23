import React, { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export function InputPassword({
  name = "Password",
  password,
  setPassword,
  id = "password-toogle-show",
  error,
}: {
  name?: string;
  password: string;
  setPassword: (password: string) => void;
  id?: string;
  error?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <FormControl
      error={error}
      variant="outlined"
      margin="normal"
      fullWidth
      required
    >
      <InputLabel htmlFor={id}>{name}</InputLabel>
      <OutlinedInput
        id={id}
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow((s) => !s)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {show ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={90}
        name={name}
        autoComplete="current-password"
      />
    </FormControl>
  );
}
