FROM gcr.io/prysmaticlabs/prysm/validator:latest as validator

FROM debian:buster-slim

COPY --from=validator /app/validator/validator.runfiles/prysm/validator/validator_/validator /usr/local/bin

RUN apt update && \
    apt install -y ca-certificates file git && \
    rm -rf /var/lib/apt/lists/*

RUN /usr/local/bin/validator --version
COPY entrypoint.sh .

ENTRYPOINT [ "./entrypoint.sh" ]
