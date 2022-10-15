/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import { useMemo } from "react"

import type { TocItem } from "@/lib/pipeline/toc/types"

export const tocHeadingIds = (toc: TocItem[]): string[] => {
  return toc.length === 0 ? [] : toc.flatMap(({ id, children }) => ([
    id,
    ...tocHeadingIds(children)
  ]))
}

export const useTocHeadingIds = (toc: TocItem[]) => {
  return useMemo(() => tocHeadingIds(toc), [toc])
}