import React from "react";
import { LayoutItem } from "components/LayoutItem";
import { ValidatorsImportFiles } from "components/ValidatorsImportFiles";
import { TitlePage } from "components/Title";

export function ValidatorsImport() {
  return (
    <>
      <TitlePage>Import validators</TitlePage>

      <LayoutItem>
        <ValidatorsImportFiles />
      </LayoutItem>
    </>
  );
}
