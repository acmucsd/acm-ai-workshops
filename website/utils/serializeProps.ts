import fs from 'fs';
import path from 'path';

const SERDE_DIR = path.join(process.cwd(), '.serde');

const PROPS_PATH = '__props.json';

export const ser = (data: any, target: string = PROPS_PATH) => {
  fs.writeFileSync(path.join(SERDE_DIR, target), JSON.stringify(data))
}

export const des = (target: string = PROPS_PATH) => {
  return JSON.parse(fs.readFileSync(path.join(SERDE_DIR, target), 'utf8').toString())
}