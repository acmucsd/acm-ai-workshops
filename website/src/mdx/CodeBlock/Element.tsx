/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import Container from './Container';
import c from 'clsx';

import { lightTheme } from './theme';

import s from './styles.module.scss';

import type { CodeBlockProps } from '.';

// <pre> tags in markdown map to CodeBlocks. They may contain JSX children. When
// the children is not a simple string, we just return a styled block without
// actually highlighting.
export default function CodeBlockJSX({
  theme = lightTheme,
  children,
  className,
}: CodeBlockProps): JSX.Element {
  return (
    <Container
      as="pre"
      tabIndex={0}
      className={c(s.standalone, className)}
      theme={theme}
    >
      <code className={s.lines}>{children}</code>
    </Container>
  );
}