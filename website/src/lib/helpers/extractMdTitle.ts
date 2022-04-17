// TODO: work directly with the ast to grab the first h1 heading.
//  can also look into grabbing description from paragraph below as well
//  would likely have to enforce workshops have first cell be text in the form
//
//      # Workshop Title
//      description
//  
//      (actual content, e.g. cells, etc)
export const extractTitleFromMdString = (md: string) => {
  return md.match(/^\s*# (?<title>.*)$/m)?.groups?.title;
}