/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import c from "clsx"

import Toc from "."

import { markdown } from "@/mdx/markdown.module.scss"
import s from "./styles.module.scss"

import type { TocProps } from "../Toc"

interface TocDesktopProps extends Omit<TocProps, 'linkClassName' | 'activeClassName'> {}

export default function TocDesktop ({
  toc,
  minLevel = 2,
  maxLevel = 4,
  className,
}: TocDesktopProps) {
  
  return (
    <nav className={c(s.nav, className)}>
      <h2 className={s.heading}>Table of Contents</h2>
      <TocDesktopItems
        toc={toc}
        minLevel={minLevel}
        maxLevel={maxLevel}
      />
    </nav>
  )
}

export const TocDesktopItems = ({
  toc,
  minLevel = 2,
  maxLevel = 4,
  className,
  linkClassName,
  linkActiveClassName,
}: TocProps) => (
  <Toc
    className={c(markdown, s.toc, s.items, className)}
    toc={toc}
    minLevel={minLevel}
    maxLevel={maxLevel}
    linkClassName={c(s.link, linkClassName)}
    linkActiveClassName={c(s.active, linkActiveClassName)}
  />
)