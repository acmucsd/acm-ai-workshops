/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

 import { useCallback, useEffect, useRef, useState } from 'react';
 import c from 'clsx';
 import copy from 'copy-text-to-clipboard';
 
 import s from './styles.module.scss';
 
interface CopyButtonProps {
  code: string;
}

 export default function CopyButton({ code }: CopyButtonProps): JSX.Element {
   const [isCopied, setIsCopied] = useState(false);
   const copyTimeout = useRef<number | undefined>(undefined);
   const handleCopyCode = useCallback(() => {
     copy(code);
     setIsCopied(true);
     copyTimeout.current = window.setTimeout(() => {
       setIsCopied(false);
     }, 1000);
   }, [code]);
 
   useEffect(() => () => window.clearTimeout(copyTimeout.current), []);
 
   return (
     <button
       type="button"
       aria-label={isCopied ? 'Copied' : 'Copy code to clipboard'}
       title="Copy"
       className={c(
         s.copyButton,
         s.cleanBtn,
         isCopied && s.copied,
       )}
       onClick={handleCopyCode}>
       <span className={s.icons} aria-hidden="true">
         <svg className={s.copyIcon} viewBox="0 0 24 24">
           <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
         </svg>
         <svg className={s.successIcon} viewBox="0 0 24 24">
           <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
         </svg>
       </span>
     </button>
   );
 }