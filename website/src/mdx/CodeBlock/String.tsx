/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import React from 'react';
import c from 'clsx';
import Highlight, { defaultProps } from 'prism-react-renderer';

import Container from './Container';
import CopyButton from './CopyButton';
import Line from './Line';
import { lightTheme } from './theme';
import { parseCodeBlockTitle, parseLanguage } from './utils';

import s from './styles.module.scss';

import type { Language } from 'prism-react-renderer';
import type { CodeBlockProps } from '.';

interface CodeBlockStringProps extends Omit<CodeBlockProps, 'children'> {
  children: string;
}

export default function CodeBlockString({
  children,
  className: blockClassName = '',
  metastring,
  title: titleProp,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
  theme = lightTheme,
}: CodeBlockStringProps): JSX.Element {
  const parsedLanguage = parseLanguage(blockClassName)
  const language = languageProp ?? parsedLanguage;
  
  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const title = parseCodeBlockTitle(metastring) || titleProp;

  const code = children.replace(/\n$/, '');
  const showLineNumbers = showLineNumbersProp || metastring?.includes('showLineNumbers') || false;

  const containerClassName = c(
    blockClassName,
    language && (parsedLanguage !== language) && `language-${language}`, // don't want to duplicate the `language-${string}` classname
  )

  return (
    <Container
      as="div"
      className={containerClassName}
      theme={theme}
    >
      {!title ? null : <div className={s.title}>{title}</div>}
      <div className={s.content}>
        <Highlight
          {...defaultProps}
          theme={theme}
          code={code}
          language={(language ?? 'text') as Language}
        >
          {({className, tokens, getLineProps, getTokenProps}) => (
            <pre tabIndex={0} className={c(className, s.codeBlock)}>
              <code className={c(s.lines, showLineNumbers && s.numbered)}>
                {tokens.map((line, i) => (
                  <Line
                    key={i}
                    line={line}
                    getLineProps={getLineProps}
                    getTokenProps={getTokenProps}
                    showLineNumbers={showLineNumbers}
                  />
                ))}
              </code>
            </pre>
          )}
        </Highlight>
        <CopyButton code={code} />
      </div>
    </Container>
  );
}