import { fromIpynb } from "@/lib/unified/nbast-util-from-ipynb"
import { extractTitleAndDescriptionFromMdast } from "./from-mdast"

import type { Root } from "mdast";

/**
 * extracts title and description data from Jupyter notebook through its converted markdown AST structure
 */
export async function extractTitleAndDescriptionFromIpynb (ipynb: string) {
  const mdast = fromIpynb(ipynb) as Root

  return await extractTitleAndDescriptionFromMdast(mdast);
}