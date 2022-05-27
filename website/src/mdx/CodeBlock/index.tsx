/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import { Children, isValidElement } from 'react';
import { useIsBrowser } from '@/hooks/useIsBrowser';
import ElementContent from './Element';
import StringContent from './String';
 
import type { ReactNode } from 'react';
import type { PrismTheme } from 'prism-react-renderer';

export interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  metastring?: string;
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: PrismTheme
}

/**
* Best attempt to make the children a plain string so it is copyable. If there
* are react elements, we will not be able to copy the content, and it will
* return `children` as-is; otherwise, it concatenates the string children
* together.
*/
const maybeStringifyChildren = (children: ReactNode): ReactNode => {
  if (Children.toArray(children).some((el) => isValidElement(el))) {
    return children;
  }
  // The children is now guaranteed to be one/more plain strings
  return Array.isArray(children) ? children.join('') : (children as string);
}

const CodeBlock = ({ children: rawChildren, ...props }: CodeBlockProps): JSX.Element => {
  // The Prism theme on SSR is always the default theme but the site theme can
  // be in a different mode. React hydration doesn't update DOM styles that come
  // from SSR. Hence force a re-render after mounting to apply the current
  // relevant styles.
  const isBrowser = useIsBrowser();
  const children = maybeStringifyChildren(rawChildren);
  const CodeBlockComponent = typeof children === 'string' ? StringContent : ElementContent;
  return (
    <CodeBlockComponent key={String(isBrowser)} {...props}>
      {children as string}
    </CodeBlockComponent>
  );
}

export default CodeBlock;