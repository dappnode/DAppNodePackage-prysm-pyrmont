import express from "express";
import { prysmKeystoreManager } from "../prysm";
import { logs } from "../logs";

/**
 * Endpoint to download all local validator keystores
 */
export const downloadKeystoresBackup: express.Handler = async (
  req,
  res,
  next
) => {
  try {
    // Stream prysm backup command directly to express.res
    const keystoresBackup = prysmKeystoreManager.getBackup();

    const filename = `pyrmont-validators-backup.zip`;
    const mimetype = "application/zip";
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", mimetype);
    res.status(200).send(keystoresBackup);
  } catch (e) {
    logs.error(`Error on downloadKeystoresBackup`, e);
    next(e);
  }
};
