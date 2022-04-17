export const slugify = (str: string) => str
  .toLowerCase()
  .replace(/(\s|_)+/g, '-')
  .replace(/-+/g, '-')
  .replace(/[^0-9a-zA-Z-]/g, '')
;