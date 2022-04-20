/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import React, { isValidElement } from 'react';
import Link from 'next/link';

import CodeBlock from './CodeBlock';

import type { ComponentMap } from "mdx-bundler/client";
import Heading, { getHeading } from './Heading';

const MDXComponents: ComponentMap = {
  code: (props: any) => {
    const { children } = props;

    // For retrocompatibility purposes (pretty rare use case)
    // See https://github.com/facebook/docusaurus/pull/1584
    if (isValidElement(children)) {
      return children;
    }

    return !children.includes('\n')
      ? <code {...props} />
      : <CodeBlock {...props} />
  },
  a: ({ href, ...props }: any) => {
    return (
      <Link href={href}>
        <a {...props} />
      </Link>
    )
  },
  pre: (props: any) => {
    const { children } = props;

    // See comment for `code` above
    if (isValidElement(children) && isValidElement((children as any)?.props?.children)) {
      return (children as any).props.children;
    }

    return (
      <CodeBlock
        {...((isValidElement(children)
          ? children?.props
          : {...props}))}
      />
    );
  },
  h1: getHeading('h1'),
  h2: getHeading('h2'),
  h3: getHeading('h3'),
  h4: getHeading('h4'),
  h5: getHeading('h5'),
  h6: getHeading('h6'),
}

export default MDXComponents;