import { Accordion } from "@/components/ui/accordion";
import { CollectionMenu } from "./CollectionMenu";

const Sidebar = async ({
  publishedTemos = [],
  collections = [],
}: {
  publishedTemos: any[];
  collections: any[];
}) => {
  return (
    <nav className="h-full relative flex flex-col border-r border-gray-400/20 overflow-y-auto space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={collections?.map((collection: any) => collection?.id)}
        className="w-full border-none"
      >
        <CollectionMenu
          collections={collections}
          publishedTemos={publishedTemos}
        />
      </Accordion>
    </nav>
  );
};

export default Sidebar;
