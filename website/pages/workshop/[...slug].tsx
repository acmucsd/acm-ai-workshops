import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import React from "react";
import { getAllWorkshops } from "../../lib/getWorkshops";
import { notebookToMd } from "../../lib/unified/processor";
import MDXComponents from "../../mdx/components";
import { des, ser } from "../../utils/serializeProps";


const Workshop: NextPage = ({ source }: any) => {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
    }}>
      <main>
        <MDXRemote {...source} components={MDXComponents} />
      </main>
    </div>
  );
};

export default Workshop;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const content = Object.fromEntries(des().map(({ slug, content }: any) => [slug, content]))[params!.slug as string]
  const workshopNotebook = content as string;
  const workshopMd = notebookToMd(workshopNotebook).toString()
  const workshopMdx = await serialize(workshopMd)
  return {
    props: { source: workshopMdx }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllWorkshops();
  const paths = workshops.map(({ slug, content }) => (
    {
      params: {
        slug,
      },
    }
  ));

  // because next doesnt support passing props from getstaticpaths to getstaticprops:
  // workaround by creating temp file, writing necessary data there,
  // and reading it back in getstaticprops
  ser(workshops);

  return {
    paths,
    fallback: false,
  }
}