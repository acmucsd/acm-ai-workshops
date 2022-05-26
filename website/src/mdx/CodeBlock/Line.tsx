/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license-docusaurus file in the root directory of this source tree.
 */

import s from './styles.module.scss';

import type { ComponentProps } from 'react';
import type Highlight from 'prism-react-renderer';

type PrismRenderProps = Parameters<
  ComponentProps<typeof Highlight>['children']
>[0];
type Token = PrismRenderProps['tokens'][number][number];

interface CodeBlockLineProps {
  line: Token[];
  showLineNumbers: boolean;
  getLineProps: PrismRenderProps['getLineProps'];
  getTokenProps: PrismRenderProps['getTokenProps'];
}

const CodeBlockLine = ({
  line,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}: CodeBlockLineProps): JSX.Element => {
  if (line.length === 1 && line[0]!.content === '\n') { line[0]!.content = ''; }

  const lineProps = getLineProps({ line, ...(showLineNumbers && { className: s.line }) });
  const lineTokens = line.map((token, key) => <span key={key} {...getTokenProps({token, key})} />);

  return (
    <span {...lineProps}>
      {showLineNumbers ? (
        <>
          <span className={s.lineNumber} />
          <span className={s.lineContent}>{lineTokens}</span>
        </>
      ) : (
        <>
          {lineTokens}
          <br />
        </>
      )}
    </span>
  );
}

export default CodeBlockLine;