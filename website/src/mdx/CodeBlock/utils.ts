/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of this source tree.
 */

import { prismColor, prismBackgroundColor } from "./styles.export.module.scss";

import type { CSSProperties } from "react";
import type { PrismTheme } from "prism-react-renderer";

const languageClassnameRegex = /^language-(?<lang>.*)$/;
const codeBlockTitleRegex = /title=(?<quote>["'])(?<title>.*?)\1/;

export const parseLanguage = (className: string): string | undefined => {
  let lang: string | undefined;
  for (const cn of className.split(' ')) {
    lang = cn.match(languageClassnameRegex)?.groups!.lang;
    if (lang) { return lang; }
  }
  return lang
}

export const parseCodeBlockTitle = (metastring?: string): string => {
  return metastring?.match(codeBlockTitleRegex)?.groups!.title ?? '';
}

export function getPrismCssVariables(prismTheme: PrismTheme): CSSProperties {
  const mapping: {[name: keyof PrismTheme['plain']]: string} = {
    color: prismColor,
    backgroundColor: prismBackgroundColor,
  };

  const properties: {[key: string]: string} = {};
  Object.entries(prismTheme.plain).forEach(([key, value]) => {
    const varName = mapping[key];
    if (varName && typeof value === 'string') {
      properties[varName] = value;
    }
  });
  return properties;
}