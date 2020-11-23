export const prysmStatusDescription = [
  {
    name: "DEPOSITED",
    text:
      "validator's deposit has been recognized by Ethereum 1, not yet recognized by Ethereum 2",
  },
  { name: "PENDING", text: "validator is in Ethereum 2's activation queue" },
  { name: "ACTIVE", text: "validator is active" },
  {
    name: "EXITING",
    text:
      "validator has initiated an an exit request, or has dropped below the ejection balance and is being kicked out",
  },
  { name: "EXITED", text: "validator is no longer validating" },
  {
    name: "SLASHING",
    text: "validator has been kicked out due to meeting a slashing condition",
  },
  {
    name: "UNKNOWN_STATUS",
    text: "validator does not have a known status in the network",
  },
];
