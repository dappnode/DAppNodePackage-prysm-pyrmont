import React from "react";
import { useLocation } from "react-router";
import { TitlePage } from "components/Title";

export function NoMatch() {
  const location = useLocation();

  return (
    <TitlePage>
      No match for <code>{location.pathname}</code>
    </TitlePage>
  );
}
