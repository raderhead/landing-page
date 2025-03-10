
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BlogContentBlock, TEXT_COLORS, FONT_SIZES, TEXT_ALIGNMENTS } from '@/types/blog';
import ContentBlock from './ContentBlock';
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, 
  Italic, Underline
} from "lucide-react";

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
  // Format command handler
  const handleFormatCommand = (command: string) => {
    if (activeBlockId) {
      document.execCommand(command, false);
      
      // Store the formatted HTML
      const block = contentBlocks.find(block => block.id === activeBlockId);
      if (block) {
        const editorElement = document.getElementById(`editor-${activeBlockId}`);
        if (editorElement) {
          const formattedHtml = editorElement.innerHTML
            .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
            .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
            .replace(/<div><br><\/div>/g, '<br>')
            .replace(/<div>/g, '<br>')
            .replace(/<\/div>/g, '')
            .replace(/^\s*<br>/g, '');
            
          onContentBlockChange(activeBlockId, formattedHtml);
        }
      }
    }
  };

  return (
    <div className="border border-input rounded-md p-4 space-y-4">
      {/* Global format toolbar at the top */}
      <div className="flex flex-wrap gap-2 mb-6 p-2 bg-background border rounded-md">
        <div className="flex border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => activeBlockId && onBlockStyleChange(activeBlockId, 'align', 'left')}
            className={activeBlockId && contentBlocks.find(b => b.id === activeBlockId)?.style?.align === 'left' ? "bg-luxury-gold/20" : ""}
            disabled={!activeBlockId}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => activeBlockId && onBlockStyleChange(activeBlockId, 'align', 'center')}
            className={activeBlockId && contentBlocks.find(b => b.id === activeBlockId)?.style?.align === 'center' ? "bg-luxury-gold/20" : ""}
            disabled={!activeBlockId}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => activeBlockId && onBlockStyleChange(activeBlockId, 'align', 'right')}
            className={activeBlockId && contentBlocks.find(b => b.id === activeBlockId)?.style?.align === 'right' ? "bg-luxury-gold/20" : ""}
            disabled={!activeBlockId}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => activeBlockId && onBlockStyleChange(activeBlockId, 'align', 'justify')}
            className={activeBlockId && contentBlocks.find(b => b.id === activeBlockId)?.style?.align === 'justify' ? "bg-luxury-gold/20" : ""}
            disabled={!activeBlockId}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormatCommand('bold')}
            disabled={!activeBlockId}
            title="Bold text"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormatCommand('italic')}
            disabled={!activeBlockId}
            title="Italic text"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormatCommand('underline')}
            disabled={!activeBlockId}
            title="Underline text"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        
        <select
          value={activeBlockId ? contentBlocks.find(b => b.id === activeBlockId)?.style?.fontSize || 'text-base' : 'text-base'}
          onChange={(e) => activeBlockId && onBlockStyleChange(activeBlockId, 'fontSize', e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={!activeBlockId}
        >
          {FONT_SIZES.map(size => (
            <option key={size.value} value={size.value}>{size.name}</option>
          ))}
        </select>
        
        <select
          value={activeBlockId ? contentBlocks.find(b => b.id === activeBlockId)?.style?.color || '#121212' : '#121212'}
          onChange={(e) => activeBlockId && onBlockStyleChange(activeBlockId, 'color', e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={!activeBlockId}
        >
          {TEXT_COLORS.map(color => (
            <option key={color.value} value={color.value}>{color.name}</option>
          ))}
        </select>
      </div>

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
