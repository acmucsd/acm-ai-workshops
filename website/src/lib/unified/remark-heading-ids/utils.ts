/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import { slugify } from "@/utils/slugify";

// Input: ## Some heading {#some-heading}
// Output: {text: "## Some heading", id: "some-heading"}
export const parseMarkdownHeadingId = (heading: string): { text: string, id?: string } => {
  const customHeadingIdRegex = /^(.*?)\s*\{#([\w-]+)\}$/
  const matches = customHeadingIdRegex.exec(heading)
  if (matches) {
    return {
      text: matches[1],
      id: matches[2],
    };
  } else {
    return { text: heading, id: undefined }
  }
}

export type Slugger = {
  slug: (value: string) => string
}

export const createSlugger = (): Slugger => {
  const seen: Record<string, number> = {}
  return {
    slug: (value) => {
      const slugified = slugify(value)
      let uniqueSlug = slugified
      let count = 0
      while (seen.hasOwnProperty(uniqueSlug)) {
        uniqueSlug = `${slugified}-${++count}`
      }
      seen[uniqueSlug] = 0

      return uniqueSlug
    }
  }
}