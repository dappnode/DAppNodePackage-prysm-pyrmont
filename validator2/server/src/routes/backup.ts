import fs from "fs";
import express from "express";
import AdmZip from "adm-zip";
import { keystoreManager } from "../services/keystoreManager";
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
    const keystoresBackup = prepareKeystoresBackup();

    const filename = `medalla-validators-backup.zip`;
    const mimetype = "application/zip";
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", mimetype);
    res.status(200).send(keystoresBackup);
  } catch (e) {
    logs.error(`Error on downloadKeystoresBackup`, e);
    next(e);
  }
};

function prepareKeystoresBackup(): Buffer {
  const zip = new AdmZip();

  const validatorPaths = keystoreManager.getValidatorsPaths();
  validatorPaths.forEach(({ keystorePath, secretPath }, i) => {
    zip.addFile(`keystore-${i}.json`, fs.readFileSync(keystorePath));
    zip.addFile(`password-${i}.json`, fs.readFileSync(secretPath));
  });

  // get everything as a buffer
  return zip.toBuffer();
}
