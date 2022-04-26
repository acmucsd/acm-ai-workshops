/**
 * converts an array of slug parts to a valid internal href
 * @param slug slug array to convert
 * @param baseUrl the base url
 * @returns the valid href
 */
export const slugToHref = (slug: string[], baseUrl: string = '') => {
  // if the baseUrl is absolute, preserve the fact that it's absolute
  if (baseUrl.startsWith('/')) {
    const relativeHref = [baseUrl.substring(1), ...slug].map(encodeURIComponent).join('/');
    return `/${relativeHref}`;
  }
  return [baseUrl, ...slug].map(encodeURIComponent).join('/');
}