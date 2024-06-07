import { list } from "@vercel/blob";

export const fetchTemos = async (): Promise<any> => {
  const { blobs } = await list({ prefix: "temos/", mode: "folded" });
  const temoDetails = blobs
    ?.sort((a: any, b: any) => b?.uploadedAt - a?.uploadedAt)
    ?.find((blob: any) => blob.pathname.endsWith("temos.json"));
  if (!temoDetails?.url) {
    return { publishedTemos: [], collections: [] };
  } else {
    const allTemos = await getTemos(temoDetails?.url);

    const publishedTemos =
      allTemos?.filter((temo: any) => temo?.isPublished) || [];

    let collections: {
      id: string;
      name: string;
    }[] = [];

    publishedTemos?.forEach((temo: any) => {
      if (
        temo?.folderId &&
        !collections.find(
          (collection: any) => collection?.id === temo?.folderId
        )
      ) {
        collections.push({ id: temo?.folderId, name: temo?.folderName });
      }
    });

    return { publishedTemos, collections };
  }
};

async function getTemos(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}
