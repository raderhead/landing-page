
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BlogContentBlock } from '@/types/blog';
import ContentBlock from './ContentBlock';

interface ContentBlockListProps {
  contentBlocks: BlogContentBlock[];
  activeBlockId: string | null;
  onContentBlockChange: (id: string, content: string) => void;
  onBlockStyleChange: (id: string, styleProp: string, value: string) => void;
  onBlockTypeChange: (id: string, newType: BlogContentBlock['type']) => void;
  removeContentBlock: (id: string) => void;
  addContentBlock: () => void;
  setActiveBlockId: (id: string) => void;
  applyFormatToSelection: (id: string, formatType: string, formatValue: string) => void;
  formatTextForPreview: (content: string) => React.ReactNode;
  textareaRefs: React.MutableRefObject<{[key: string]: HTMLTextAreaElement | null}>;
}

const ContentBlockList: React.FC<ContentBlockListProps> = ({
  contentBlocks,
  activeBlockId,
  onContentBlockChange,
  onBlockStyleChange,
  onBlockTypeChange,
  removeContentBlock,
  addContentBlock,
  setActiveBlockId,
  applyFormatToSelection,
  formatTextForPreview,
  textareaRefs
}) => {
  return (
    <div className="border border-input rounded-md p-4 space-y-4">
      {contentBlocks.map((block) => (
        <ContentBlock
          key={block.id}
          block={block}
          activeBlockId={activeBlockId}
          onBlockStyleChange={onBlockStyleChange}
          onContentChange={onContentBlockChange}
          onBlockTypeChange={onBlockTypeChange}
          onRemoveBlock={removeContentBlock}
          onSetActiveBlock={setActiveBlockId}
          formatTextForPreview={formatTextForPreview}
          onFormatSelection={applyFormatToSelection}
          textareaRef={el => textareaRefs.current[block.id] = el}
        />
      ))}
      
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={addContentBlock}
          className="text-luxury-gold border-luxury-gold/50 hover:bg-luxury-gold/10"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Content Block
        </Button>
      </div>
    </div>
  );
};

export default ContentBlockList;
