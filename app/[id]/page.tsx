import TemoPlayer from "@/components/TemoPlayer";
import { list } from "@vercel/blob";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

const fetchArticle = async (url: string) => {
  if (!url) {
    return "";
  }
  const response = await fetch(url);

  const text = await response.text();
  return text;
};

const fetchFilePaths = async (url: string) => {
  const { blobs } = await list({
    prefix: `temos/${decodeURIComponent(url)}`,
  });
  let temo: any = {
    id: url,
    eventsFileUrl: null,
    articles: [],
  };
  blobs
    ?.sort((a: any, b: any) => a.uploadedAt - b.uploadedAt)
    .forEach((blob: any) => {
      if (blob.pathname.endsWith("events.json")) {
        temo.eventsFileUrl = blob.url;
      }

      if (blob.pathname.endsWith(".md")) {
        let lang = blob.pathname.split("/").pop()?.split(".")[0];
        temo.articles.push({
          lang,
          url: blob.url,
        });
      }
    });
  return temo;
};

const extractHeadings = (markdown: string) => {
  const tree = unified().use(remarkParse).parse(markdown);
  const headings: { text: string; id: string }[] = [];

  visit(tree, "heading", (node: any) => {
    const text = node.children.map((child: any) => child.value).join("");
    const id = text.toLowerCase().replace(/\s+/g, "-");
    headings.push({ text, id });
  });

  return headings;
};

export default async function Temo({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  let temosWithPaths = await fetchFilePaths(params.id);
  let article = await fetchArticle(temosWithPaths?.articles[0]?.url);
  const headings = extractHeadings(article);
  return (
    <div className="grid grid-cols-10 gap-4 items-center">
      <Tabs
        orientation="vertical"
        defaultValue="article"
        className="w-full justify-center items-center col-span-8 pt-8"
      >
        <TabsList className="">
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="player">Player</TabsTrigger>
        </TabsList>
        <TabsContent
          value="article"
          className="overflow-auto h-[calc(100vh-160px)]"
        >
          <ReactMarkdown className="w-full border border-gray-400/20 rounded-md p-8 shadow-sm mb-4 article ">
            {article}
          </ReactMarkdown>
        </TabsContent>
        <TabsContent value="player">
          <TemoPlayer
            key={temosWithPaths?.id}
            eventsPath={temosWithPaths?.eventsFileUrl}
          />
        </TabsContent>
      </Tabs>
      <div className="h-full border-l border-gray-400/20 space-y-4 p-4 col-span-2 pt-16">
        <ul className="no-list-style space-y-2">
          {headings
            ?.slice(1) // Skip the first heading
            .map((heading) => (
              <li key={heading?.id} className="no-list-style">
                <a href={`#${heading?.id}`}>{heading?.text}</a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
