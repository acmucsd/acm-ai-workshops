/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import { useEffect, useMemo, useRef, useState } from "react"

import { noop } from "@/utils/noop"
import useTocHeadingIds from "./heading-ids"

import { navbarHeight } from "@/components/Navbar/styles.export.module.scss"

import type { TocItem } from "@/lib/unified/toc/types"

// If the anchor has no height and is just a "marker" in the dom we'll use the parent (normally the link text) rect boundaries instead
const getVisibleBoundingClientRect = (element: HTMLElement | null): DOMRect | null => {
  if (!element) { return null }
  const rect = element.getBoundingClientRect()
  const hasNoHeight = rect.top === rect.bottom
  return hasNoHeight
    ? getVisibleBoundingClientRect(element.parentNode as HTMLElement | null)
    : rect
}

// Considering we divide viewport into 3 zones of each 100/3vh
// This returns true if an element is in the first zone (ie, appear in viewport, near the top)
const isInViewportTopHalf = (boundingRect: DOMRect, threshold: number) => {
  return boundingRect.top > threshold && boundingRect.bottom < window.innerHeight / 3
}

const useAnchors = (toc: TocItem[]) => {
  const headingIds = useTocHeadingIds(toc)
  const headingIdsSelector = useMemo(() => headingIds.map((id) => `#${id}`).join(','), [headingIds])
  
  const [anchors, setAnchors] = useState<HTMLElement[]>([])
  
  useEffect(() => {
    if (headingIdsSelector) {
      setAnchors(Array.from(document.querySelectorAll(headingIdsSelector)) as HTMLElement[])
    }
  }, [headingIdsSelector])
  
  return anchors
}

type GetActiveAnchorConfig = {
  anchorTopOffset: number
}

const getActiveAnchor = (
  anchors: HTMLElement[],
  { anchorTopOffset }: GetActiveAnchorConfig,
): Element | null => {
  if (anchors.length === 0) { return null }
  
  // Naming is hard
  // The "nextVisibleAnchor" is the first anchor that appear under the viewport top boundary
  // Note: it does not mean this anchor is visible yet, but if user continues scrolling down, it will be the first to become visible
  let nextVisibleAnchor = anchors[0]
  for (const anchor of anchors) {
    const boundingRect = getVisibleBoundingClientRect(anchor)
    if (!boundingRect) { return null }
    nextVisibleAnchor = anchor
    if (boundingRect.top >= anchorTopOffset) { break }
  }

  if (nextVisibleAnchor) {
    const boundingRect = getVisibleBoundingClientRect(nextVisibleAnchor) as DOMRect
    // If anchor is in the top half of the viewport: it is the one we consider "active"
    // (unless it's too close to the top and and soon to be scrolled outside viewport)
    if (isInViewportTopHalf(boundingRect, anchorTopOffset)) {
      return nextVisibleAnchor
    }
    // If anchor is in the bottom half of the viewport, or under the viewport, we consider the active anchor is the previous one
    // This is because the main text appearing in the user screen mostly belong to the previous anchor
    else {
      // Returns null for the first anchor, see https://github.com/facebook/docusaurus/issues/5318
      return anchors[anchors.indexOf(nextVisibleAnchor) - 1] ?? null
    }
  }
  // no anchor under viewport top? (ie we are at the bottom of the page)
  // => highlight the last anchor found
  else {
    return anchors[anchors.length - 1]
  }
}

const getLinkAnchorValue = (link: HTMLAnchorElement) => {
  return decodeURIComponent(link.href.substring(link.href.indexOf('#') + 1))
}

const getLinks = (linkClassName: string) => {
  return Array.from(document.getElementsByClassName(linkClassName)) as HTMLAnchorElement[]
}

export type TocHighlightConfig = {
  linkClassName: string
  linkActiveClassName: string
}

const useActiveTocItem = (toc: TocItem[], config?: TocHighlightConfig) => {
  const lastActiveLinkRef = useRef<HTMLAnchorElement | undefined>(undefined)

  const anchorTopOffset = navbarHeight

  const anchors = useAnchors(toc)

  const cancelScroll = useRef<() => void>(noop)

  useEffect(() => {
    // no-op, highlighting is disabled
    if (!config) { return noop }

    const {
      linkClassName,
      linkActiveClassName,
    } = config

    const scheduleScroll = (link: HTMLAnchorElement) => {
      const handle = setTimeout(() => {
        const linkRect = link.getBoundingClientRect()
        const viewport = window.visualViewport
        // Only scroll if a vertical scroll is sufficient to bring the link into view.
        // e.g. if the window is pinch-zoomed, we should not horizontally scroll
        if (
          linkRect.right <= viewport.pageLeft + viewport.width
          && linkRect.left >= viewport.pageLeft
        ) {
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      // dont interrupt smooth scroll. this is kinda arbitrary at the moment,
      // 17ms (60fps) would work some of the time but inconsistent and sometimes fail
      // 250ms seems to make failure much less likely, while still keeping updates looking "snappy" enough
      }, 250)
      return () => { clearTimeout(handle) }
    }

    const updateActiveLink = () => {
      const links = getLinks(linkClassName)
      const activeAnchor = getActiveAnchor(anchors, { anchorTopOffset })

      links.forEach((link) => {
        if (activeAnchor?.id === getLinkAnchorValue(link)) {
          if (lastActiveLinkRef.current !== link) {
            lastActiveLinkRef.current?.classList.remove(linkActiveClassName)
          }
          link.classList.add(linkActiveClassName)
          lastActiveLinkRef.current = link
          cancelScroll.current()
          cancelScroll.current = scheduleScroll(link)
        } else {
          link.classList.remove(linkActiveClassName)
        }
      })
    }

    document.addEventListener('scroll', updateActiveLink)
    document.addEventListener('resize', updateActiveLink)

    updateActiveLink()

    return () => {
      document.removeEventListener('scroll', updateActiveLink)
      document.removeEventListener('resize', updateActiveLink)
    }
  }, [config, anchorTopOffset])
}

export default useActiveTocItem