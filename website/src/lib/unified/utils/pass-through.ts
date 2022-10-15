import type { Handle } from "rehype-remark"

/**
 * rehype-remark handler function that simply returns the same node
 *  this should be used with node types passed to `passThrough` for remark-rehype 
 */
export const passThrough: Handle = (h, n) => n