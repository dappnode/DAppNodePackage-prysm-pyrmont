#!/usr/bin/env bash

mkdir -p /root/.eth2wallets/
echo "$WALLET_PASSWORD" > /root/.eth2wallets/wallet-password.txt

exec validator \
  --pyrmont \
  --datadir=/root/.eth2 \
  --rpc-host 0.0.0.0 \
  --grpc-gateway-host 0.0.0.0 \
  --monitoring-host 0.0.0.0 \
  --beacon-rpc-provider=$BEACON_RPC_PROVIDER \
  --beacon-rpc-gateway-provider=$BEACON_RPC_GATEWAY_PROVIDER \
  --wallet-dir=/root/.eth2validators \
  --wallet-password-file=/root/.eth2wallets/wallet-password.txt \
  --graffiti=$GRAFFITI \
  --web \
  --grpc-gateway-host=0.0.0.0 \
  --grpc-gateway-port=80 \
  --grpc-gateway-corsdomain=http://prysm-pyrmont-validator.dappnode \
  --accept-terms-of-use \
  $EXTRA_OPTS
