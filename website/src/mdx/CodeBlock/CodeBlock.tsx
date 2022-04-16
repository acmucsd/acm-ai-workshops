/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme/CodeBlock
 */

import Highlight, { defaultProps } from 'prism-react-renderer';
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import copy from 'copy-text-to-clipboard';

import theme from 'prism-react-renderer/themes/vsLight';

import styles from './styles.module.scss';

const CodeBlock = (props: any): JSX.Element => {
  const {
    children,
    metastring,
    title,
    className: languageClassName,
  } = props;

  const [showCopied, setShowCopied] = useState(false);
  const button = useRef(null);
  const handleCopyCode = () => {
    copy(code);
    setShowCopied(true);

    setTimeout(() => setShowCopied(false), 2000);
  };

  const content = Array.isArray(children)
    ? children.join('')
    : (children as string) ?? '';
  const code = content.replace(/\n$/, '');

  const language = languageClassName?.replace(/language-/, '');

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={code}
      language={language}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <div className={styles.codeBlockContainer}>
          {title && (
            <div style={style} className={styles.codeBlockTitle}>
              {title}
            </div>
          )}
          <div className={clsx(styles.codeBlockContent, language)}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
              style={style}>
              <code className={styles.codeBlockLines}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0].content === '\n') {
                    line[0].content = '';
                  }

                  const lineProps = getLineProps({line, key: i});

                  return (
                    <span key={i} {...lineProps}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({token, key})} />
                      ))}
                      <br />
                    </span>
                  );
                })}
              </code>
            </pre>

            <button
              ref={button}
              type="button"
              aria-label={'Copy code to clipboard'}
              className={clsx(styles.copyButton, styles.cleanBtn)}
              onClick={handleCopyCode}>
              {showCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </Highlight>
  )
}

export default CodeBlock;

