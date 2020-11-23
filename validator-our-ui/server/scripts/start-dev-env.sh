concurrently -n ui,server,schemas \
  "cd ../ui && yarn mock" \
  "cd . && yarn dev" \
  "cd ../ui && yarn schemas-watch" \