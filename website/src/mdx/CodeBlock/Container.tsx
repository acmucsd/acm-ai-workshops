/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import c from 'clsx';

import { getPrismCssVariables } from './utils';

import s from './styles.module.scss';

import type { ComponentProps } from 'react';
import type { PrismTheme } from 'prism-react-renderer';

interface CodeBlockContainerProps<T extends 'div' | 'pre'>  {
  as: T
  theme: PrismTheme
}

const CodeBlockContainer = <T extends 'div' | 'pre'>({
  as: As,
  theme,
  className,
  ...props
}: CodeBlockContainerProps<T> & ComponentProps<T>): JSX.Element => {
  const prismCssVariables = getPrismCssVariables(theme);
  return (
    <As
      // Polymorphic components are hard to type, without `oneOf` generics
      {...(props as never)}
      style={prismCssVariables}
      className={c(className, s.codeBlockContainer)}
    />
  );
}

export default CodeBlockContainer;