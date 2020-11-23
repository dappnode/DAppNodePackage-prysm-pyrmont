export const paths = {
  validatorByPubkey: {
    match: "/validator/:pubkey",
    to: (pubkey: string) => `/validator/${pubkey}`,
  },
  validatorsImport: "/validators-import",
  validatorsExport: "/validators-export",
  settings: "/settings",
  home: "/",
};
