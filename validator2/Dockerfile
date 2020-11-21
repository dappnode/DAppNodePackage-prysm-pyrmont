################
# UI build
################
FROM --platform=${BUILDPLATFORM:-amd64} node:buster-slim as build-ui
WORKDIR /app
# Copy and install deps first to cache
COPY build/ui/package.json build/ui/yarn.lock ./
RUN yarn
COPY build/ui .
RUN yarn schemas-generate
RUN yarn build
# Results in build/*

################
# Server build
################
FROM --platform=${BUILDPLATFORM:-amd64} node:buster-slim as build-server
WORKDIR /app
COPY build/server/package.json build/server/yarn.lock ./
RUN yarn
COPY build/server .
COPY --from=build-ui /app/src/common ../ui/src/common
RUN yarn prepare
RUN yarn build
# Results in build/index.js

################
# Git data
################
FROM --platform=${BUILDPLATFORM:-amd64} node:buster-slim as git-data
WORKDIR /app
RUN apt update && apt install --assume-yes git
COPY .git .git
COPY dappnode_package.json .
COPY build/getGitData.js .
RUN node getGitData /app/.git-data.json
# Results in /app/.git-data.json

################
# Prysm binary
################
FROM debian:buster-slim as validator-binary

ARG TARGETARCH
ARG UPSTREAM_VERSION_PRYSM
ENV DOWNLOAD_URL https://github.com/prysmaticlabs/prysm/releases/download

RUN DEBIAN_FRONTEND=noninteractive \
  apt update && apt install --assume-yes --no-install-recommends wget ca-certificates
RUN wget -q $DOWNLOAD_URL/$UPSTREAM_VERSION_PRYSM/validator-$UPSTREAM_VERSION_PRYSM-linux-${TARGETARCH:-amd64} -O /usr/local/bin/validator && \
  chmod +x  /usr/local/bin/validator && \
  rm -rf /var/lib/apt/lists/*


################
# Final layer
################
FROM debian:buster-slim

ENV NODE_ENV production
ENV SERVER_PORT 80
ENV CLIENT_FILES_PATH dist
ENV DATA_PATH /root/.config/ethereum2
ENV DB_API_DIR /app/db-api
ENV GIT_DATA_PATH /app/.git-data.json
ENV WORKDIR /app

# ETH2 Config
ENV ETH2_NETWORK_NAME Pyrmont Testnet

WORKDIR ${WORKDIR}

# Add Lighthouse dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  libssl-dev \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ADD build/ssl /app/ssl
COPY --from=node:10.20.1-buster-slim /usr/local/bin/node /usr/local/bin
# Get Prysm binary
COPY --from=validator-binary /usr/local/bin/validator /usr/local/bin/
# Copy app files
COPY --from=build-ui /app/build ${CLIENT_FILES_PATH}
COPY --from=build-server /app/build server
COPY --from=git-data /app/.git-data.json $GIT_DATA_PATH

# Verify binaries are in correct arch
RUN validator --version

CMD ["node", "server"]
