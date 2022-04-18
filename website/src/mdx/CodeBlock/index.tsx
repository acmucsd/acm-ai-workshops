/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

// taken from https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme/CodeBlock

import React, { useRef, useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import c from 'clsx';
import copy from 'copy-text-to-clipboard';

import s from './styles.module.scss';

// we can change this theme tbh. could also look into making a custom one too
import theme from 'prism-react-renderer/themes/vsLight';

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
        <div className={s.codeBlockContainer}>
          {title && (
            <div style={style} className={s.codeBlockTitle}>
              {title}
            </div>
          )}
          <div className={c(s.codeBlockContent, language)}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={c(className, s.codeBlock, 'thin-scrollbar')}
              style={style}>
              <code className={s.codeBlockLines}>
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
              className={c(s.copyButton, s.cleanBtn)}
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

