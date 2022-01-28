import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { promisify } from 'util';

const workshopsDirectory = path.join(process.cwd(), '..');

const slugify = (filepathArray: string | string[]) => {
  if (!Array.isArray(filepathArray)) {
    filepathArray = filepathArray.split('/')
  }
  return filepathArray.map((filepath) => filepath.toLowerCase().replace(/.ipynb$/, '').replace(/[^\w /]+/g, '').replace(/ +/g, '-'));
}

export const getWorkshopPaths = async () => {
  const workshopPaths = await promisify(glob)(`**/*.ipynb`, { cwd: workshopsDirectory })
  return workshopPaths;
}

export const getWorkshopByPath = async (filepath: string) => {
  const fullPath = path.join(workshopsDirectory, filepath);
  const fileContents = await promisify(fs.readFile)(fullPath, 'utf8');
  return fileContents;
}

export const getAllWorkshops = async () => {
  const filepaths = await getWorkshopPaths();
  const workshops = await Promise.all(filepaths.map(async (filepath) => ({
    slug: slugify(filepath),
    content: await getWorkshopByPath(filepath),
  })));
  return workshops;
}