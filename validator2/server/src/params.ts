export const dataPath = process.env.DATA_PATH || "data";
export const eth1Web3Url =
  process.env.WEB3PROVIDER || "https://goerli.dappnode.net";
export const GRAFFITI = process.env.GRAFFITI || "";

// Config
export const SHOW_ALL_VALIDATORS = true;

/**
 * Medalla settings
 */
export const DEPOSIT_CONTRACT_ADDRESS =
  "0x07b39F4fDE4A38bACe212b546dAc87C58DfE3fDC";
export const DEPOSIT_CONTRACT_BLOCK = 3085928;

/**
 * Common keystores stores on disk
 */
export const VALIDATOR_KEYSTORES_DIR = "/validators/keystores";
export const VALIDATOR_SECRETS_DIR = "/validators/secrets";

/**
 * DAppNode URLs
 */
const INSTALL_DNP_URL = "http://my.dappnode/#/installer/";
const PACKAGE_DNP_URL = "http://my.dappnode/#/packages/";

/**
 * Prysm config and paths
 */
export const PRYSM_BINARY = "validator";
export const PRYSM_DATA_DIR = "/prysm";
export const PRYSM_WALLET_DIR = "/prysm/.eth2validators/primary";
export const PRYSM_WALLET_PASSWORD_PATH = "/prysm/.eth2validators/primary.pass";
export const PRYSM_LOG_FILE = "/var/log/validator.log";
export const PRYSM_REST_APIURL =
  "http://prysm-medalla-beacon-chain.dappnode:3500";
export const PRYSM_VALIDATOR_APIRUL =
  "http://prysm-medalla-beacon-chain.dappnode:4000";
export const PRYSM_EXTRA_OPTS = process.env.PRYSM_EXTRA_OPTS || "";
export const PRYSM_VERBOSITY = process.env.PRYSM_VERBOSITY || "info";
export const PRYSM_DNPNAME = "prysm-medalla-beacon-chain.dnp.dappnode.eth";
export const PRYSM_INSTALL_URL = INSTALL_DNP_URL + PRYSM_DNPNAME;

/**
 * DAppNode / DAPPMANAGER params
 */
export const PUBLIC_PACKAGES_APIURL = "http://my.dappnode/public-packages";
export const DMS_DNPNAME = "dms.dnp.dappnode.eth";
export const DMS_INSTALL_LINK = INSTALL_DNP_URL + DMS_DNPNAME;

// Login password
export const adminPassword = process.env.PASSWORD;
export const disablePassword = process.env.DISABLE_PASSWORD;

// Server config
const logLevel = process.env.LOG_LEVEL;
export const logDebug = logLevel === "debug" || logLevel === "DEBUG";
export const uiFilesPath = process.env.CLIENT_FILES_PATH || "../ui/build";
export const serverPort = process.env.SERVER_PORT || 8080;
export const dbDir = process.env.DB_API_DIR || "db-api";

// Other
export const gitDataPath = process.env.GIT_DATA_PATH;
