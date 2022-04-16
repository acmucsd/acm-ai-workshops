// adapted from https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-common/src/hooks/useWindowSize.ts

import { useState, useEffect } from "react";
import { canUseDOM } from "@/utils/environment"

type WindowSize = 'desktop' | 'mobile' | 'ssr';

const DESKTOP_SIZE = 996; // TODO: TEMPORARY HARDCODED VALUE

const getWindowSize = (): WindowSize => {
  if (!canUseDOM) {
    return 'ssr'
  }
  return window.innerWidth > DESKTOP_SIZE
    ? 'desktop'
    : 'mobile';
}

const DevSimulateSSR = process.env.NODE_ENV === 'development' && true;

/**
 * Gets the current window size as an enum value. We don't want it to return the
 * actual width value, so that it only re-renders once a breakpoint is crossed.
 *
 * It may return `"ssr"`, which is very important to handle hydration FOUC or
 * layout shifts. You have to handle it explicitly upfront. On the server, you
 * may need to render BOTH the mobile/desktop elements (and hide one of them
 * with mediaquery). We don't return `undefined` on purpose, to make it more
 * explicit.
 *
 * In development mode, this hook will still return `"ssr"` for one second, to
 * catch potential layout shifts, similar to strict mode calling effects twice.
 */
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (DevSimulateSSR) {
      return 'ssr';
    }
    return getWindowSize();
  });

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize(getWindowSize());
    }

    const timeout = DevSimulateSSR
      ? window.setTimeout(updateWindowSize, 1000)
      : undefined;

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(timeout);
    };
  }, []);

  return windowSize;
}
