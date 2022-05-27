import { stat } from "fs/promises";

export const fsExists = async (path: string) =>
  await stat(path)
    .then(() => true)
    .catch(() => false)

export const isFile = async (path: string) =>
  await stat(path)
    .then((stats) => stats.isFile())
    .catch(() => false)

export const isDirectory = async (path: string) =>
  await stat(path)
    .then((stats) => stats.isDirectory())
    .catch(() => false)