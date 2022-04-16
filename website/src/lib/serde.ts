import fs from 'fs';
import path from 'path';

const SERDE_DIR = path.join(process.cwd(), '.serde');

const PROPS_PATH = '__props.json';

export const ser = (data: any, target: string = PROPS_PATH) => {
  fs.writeFileSync(path.join(SERDE_DIR, target), JSON.stringify(data))
}

const cache: Map<string, unknown> = new Map();
type DeserializeOptions = {
  useCached?: boolean;
  cacheResult?: boolean;
}
export const des = (
  target: string = PROPS_PATH,
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