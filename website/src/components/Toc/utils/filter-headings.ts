/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import { useMemo } from "react"

import type { HeadingLevel, TocItem } from "@/lib/helpers/toc/types"

interface FilterTocProps {
  toc: TocItem[]
  minLevel: HeadingLevel
  maxLevel: HeadingLevel
}

export const filterToc = ({ toc, minLevel, maxLevel }: FilterTocProps): TocItem[] => {
  const shouldInclude = (heading: TocItem) => minLevel <= heading.level && heading.level <= maxLevel

  return toc.flatMap((heading) => {
    const filteredChildren = filterToc({
      toc: heading.children,
      minLevel,
      maxLevel,
    })
    return shouldInclude(heading)
      ? [{...heading, children: filteredChildren }]
      : filteredChildren
  })
}

const useTocFilter = ({
  toc,
  minLevel,
  maxLevel,
}: FilterTocProps) => {
  return useMemo(() => (
    filterToc({ toc, minLevel, maxLevel })
  ), [toc, minLevel, maxLevel])
}

export default useTocFilter