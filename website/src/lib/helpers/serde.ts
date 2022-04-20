/**
 * serialize/deserialize utility functions for passing data
 *  between `getStaticPaths` and `getStaticProps`, because that isn't supported yet
 */

import fs from 'fs';
import path from 'path';

const SERDE_DIR = path.join(process.cwd(), '.serde');

/**
 * serializes data to a file
 * @param data data to serialize
 * @param target filename to serialize to. relative to the `.serde` folder in the website root
 */
export const ser = (data: any, target: string) => {
  fs.writeFileSync(path.join(SERDE_DIR, target), JSON.stringify(data))
}

const cache: Map<string, unknown> = new Map();
type DeserializeOptions = {
  useCached?: boolean;
  cacheResult?: boolean;
}

/**
 * deserializes data from a file
 * @param target filename to serialize from. relative from `.serde` in the website root
 * @param opts options
 * @param opts.useCached whether to use cached deserialized data, if any
 * @param opts.cacheResult whether to cache the resultant data
 * @returns the deserialized data
 */
export const des = (
  target: string,
  { useCached, cacheResult}: DeserializeOptions = { useCached: true, cacheResult: true },
) => {
  if (useCached && cache.has(target)) {
    return cache.get(target);
  }
  const deserialized = JSON.parse(fs.readFileSync(path.join(SERDE_DIR, target), 'utf8').toString());

  if (cacheResult) {
    cache.set(target, deserialized);
  }
  
  return deserialized;
}