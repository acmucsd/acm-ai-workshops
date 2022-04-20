import { useEffect, useState } from "react";

/**
 * hook for checking whether the current environment is a browser,
 *  AND triggers a rerender on first render
 */
export const useIsBrowser = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser;
}