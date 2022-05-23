/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import useTocFilter from "./utils/filter-headings"
import useActiveTocItem from "./utils/active-heading"

import type { FC, MouseEventHandler } from "react"
import type { HeadingLevel, TocItem } from "@/lib/helpers/toc/types"

export interface TocProps {
  toc: TocItem[]
  minLevel?: HeadingLevel
  maxLevel?: HeadingLevel
  className?: string
  linkClassName?: string
  linkActiveClassName?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const Toc: FC<TocProps> = ({
  toc,
  minLevel = 2,
  maxLevel = 4,
  className,
  linkClassName = '',
  linkActiveClassName = '',
  onClick,
}) => {
  const filteredToc = useTocFilter({ toc, minLevel, maxLevel })

  useActiveTocItem(filteredToc, {
    linkClassName,
    linkActiveClassName,
  })

  return (
    <TocItems
      toc={filteredToc}
      className={className}
      linkClassName={linkClassName}
      onClick={onClick}
    />
  )
}

export default Toc

interface TocItemsProps {
  toc: TocItem[]
  className?: string
  linkClassName?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const TocItems: FC<TocItemsProps> = ({ toc, className, linkClassName, onClick }) => {
  return toc.length === 0 ? null : (
    <ul className={className}>
      {toc.map(({ id, children, value }) => (
        <li key={id}>
          <a
            className={linkClassName}
            href={`#${id}`}
            onClick={onClick}
            // Developer provided the HTML, so assume it's safe.
            dangerouslySetInnerHTML={{ __html: value }}
          />
          <TocItems
            toc={children}
            linkClassName={linkClassName}
            onClick={onClick}
          />
        </li>
      ))}
    </ul>
  )
}