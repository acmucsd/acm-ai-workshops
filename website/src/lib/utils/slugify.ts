/**
 * converts a string to a slug
 * specifically, replaces spaces and underscores with dashes,
 *  collapses multiple spaces/dashes into a single dash,
 *  and discards all characters other than digits, letters, and dash
 * @param str string to slugify
 * @returns the slugified string
 */
export const slugify = (str: string) => str
  .toLowerCase()
  .replace(/(\s|_)+/g, '-')
  .replace(/-+/g, '-')
  .replace(/[^0-9a-zA-Z-]/g, '')
;