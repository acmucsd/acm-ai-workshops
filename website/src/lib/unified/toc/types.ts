export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6  

export type TocItem = {
  value: string
  id: string
  children: TocItem[]
  level: HeadingLevel
}