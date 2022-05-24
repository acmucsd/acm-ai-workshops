const openingTagRegex = /^<[a-zA-Z].*>$/ // because seriously what tag starts with anything else
export const isOpeningTag = (html: string) => openingTagRegex.test(html)

const childlessTagRegex = /^<\S+.*\/>$/
export const isChildlessTag = (html: string) => childlessTagRegex.test(html)

const closingTagRegex = /^<\/.*>$/
export const isClosingTag = (html: string) => closingTagRegex.test(html)

const extractAttributesRegex = /^<(?<tag>[\S]*)(\s+(?<attrs>.*)\s*)?\/?>$/
export const parseOpeningTag = (html: string) => {
  const match = html.match(extractAttributesRegex)
  if (!match) { return null }
  const { tag, attrs } = match.groups ?? {}
  return { tag: tag.trim(), attrs: attrs?.trim?.() ?? '' }
}

const extractClosingTagRegex = /^<(?<tag>[\S]+)\/>$/
export const parseClosingTag = (html: string) => html.match(extractClosingTagRegex)?.groups?.tag