import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BlogContentBlock, TEXT_COLORS, FONT_SIZES, TEXT_ALIGNMENTS } from "@/types/blog";
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, 
  Italic, Type, Quote, List, FileImage, Underline, Trash2, Eye, Code
} from "lucide-react";

interface ContentBlockProps {
  block: BlogContentBlock;
  activeBlockId: string | null;
  onBlockStyleChange: (id: string, styleProp: string, value: string) => void;
  onContentChange: (id: string, content: string) => void;
  onBlockTypeChange: (id: string, type: BlogContentBlock['type']) => void;
  onRemoveBlock: (id: string) => void;
  onSetActiveBlock: (id: string) => void;
  formatTextForPreview: (content: string) => React.ReactNode;
  onFormatSelection: (id: string, formatType: string, formatValue: string) => void;
  textareaRef: (el: HTMLTextAreaElement | null) => void;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  activeBlockId,
  onBlockStyleChange,
  onContentChange,
  onBlockTypeChange,
  onRemoveBlock,
  onSetActiveBlock,
  formatTextForPreview,
  onFormatSelection,
  textareaRef
}) => {
  const [showRawHtml, setShowRawHtml] = useState(false);
  
  const getCleanContent = () => {
    return block.content
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<em>(.*?)<\/em>/g, '$1')
      .replace(/<u>(.*?)<\/u>/g, '$1');
  };

  return (
    <div 
      className={cn(
        "relative border border-input rounded-md p-3 space-y-2", 
        activeBlockId === block.id ? "border-luxury-gold" : ""
      )}
      onClick={() => onSetActiveBlock(block.id)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onBlockTypeChange(block.id, 'paragraph')}
            className={block.type === 'paragraph' ? "bg-luxury-gold/20" : ""}
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onBlockTypeChange(block.id, 'heading')}
            className={block.type === 'heading' ? "bg-luxury-gold/20" : ""}
          >
            <span className="font-bold">H</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onBlockTypeChange(block.id, 'quote')}
            className={block.type === 'quote' ? "bg-luxury-gold/20" : ""}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onBlockTypeChange(block.id, 'list')}
            className={block.type === 'list' ? "bg-luxury-gold/20" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onBlockTypeChange(block.id, 'image')}
            className={block.type === 'image' ? "bg-luxury-gold/20" : ""}
          >
            <FileImage className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowRawHtml(!showRawHtml)}
            className={showRawHtml ? "bg-muted" : ""}
            title={showRawHtml ? "Show formatted view" : "Show HTML tags"}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveBlock(block.id)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {block.type === 'image' ? (
        <Input
          id={`block-${block.id}`}
          value={block.content || ''}
          onChange={(e) => onContentChange(block.id, e.target.value)}
          placeholder="Enter image URL"
          className="w-full"
        />
      ) : (
        <div>
          {showRawHtml ? (
            <Textarea
              id={`block-${block.id}`}
              ref={textareaRef}
              value={block.content || ''}
              onChange={(e) => onContentChange(block.id, e.target.value)}
              placeholder={
                block.type === 'paragraph' ? "Enter paragraph text" :
                block.type === 'heading' ? "Enter heading text" :
                block.type === 'quote' ? "Enter quote text" :
                block.type === 'list' ? "Enter list items (one per line)" :
                "Enter content"
              }
              rows={block.type === 'paragraph' ? 4 : block.type === 'list' ? 3 : 2}
              className="w-full"
            />
          ) : (
            <div
              className={cn(
                "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                block.style?.fontSize || 'text-base',
                block.style?.align ? `text-${block.style.align}` : 'text-left',
                "focus-within:border-luxury-gold"
              )}
              style={{ color: block.style?.color || '#121212' }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const html = e.currentTarget.innerHTML
                  .replace(/<div>/g, '\n')
                  .replace(/<\/div>/g, '')
                  .replace(/<br>/g, '\n')
                  .replace(/&nbsp;/g, ' ');
                
                let processedContent = html;
                
                if (block.style?.fontWeight === 'bold' || e.currentTarget.querySelector('.font-bold')) {
                  processedContent = `<strong>${processedContent}</strong>`;
                }
                if (block.style?.fontStyle === 'italic' || e.currentTarget.querySelector('.italic')) {
                  processedContent = `<em>${processedContent}</em>`;
                }
                if (block.style?.textDecoration === 'underline' || e.currentTarget.querySelector('.underline')) {
                  processedContent = `<u>${processedContent}</u>`;
                }
                
                onContentChange(block.id, processedContent);
              }}
              onFocus={() => onSetActiveBlock(block.id)}
              dangerouslySetInnerHTML={{ 
                __html: block.type === 'list' 
                  ? block.content.split('\n').map(item => `<div>${item}</div>`).join('')
                  : getCleanContent().replace(/\n/g, '<br />')
              }}
            />
          )}
        </div>
      )}
      
      <FormatToolbar 
        block={block}
        onBlockStyleChange={onBlockStyleChange}
        onFormatSelection={(formatType, formatValue) => {
          onFormatSelection(block.id, formatType, formatValue);
        }}
      />
      
      {block.content && !showRawHtml && block.type !== 'image' && (
        <div className="mt-2 p-2 border rounded-md bg-muted/50">
          <div className="text-xs text-luxury-slate mb-1">Preview:</div>
          <BlockPreview 
            block={block} 
            formatTextForPreview={formatTextForPreview} 
          />
        </div>
      )}
    </div>
  );
};

interface FormatToolbarProps {
  block: BlogContentBlock;
  onBlockStyleChange: (id: string, styleProp: string, value: string) => void;
  onFormatSelection: (formatType: string, formatValue: string) => void;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({ 
  block, 
  onBlockStyleChange,
  onFormatSelection 
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex border rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onBlockStyleChange(block.id, 'align', 'left')}
          className={block.style?.align === 'left' ? "bg-luxury-gold/20" : ""}
        >
          <AlignLeft className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onBlockStyleChange(block.id, 'align', 'center')}
          className={block.style?.align === 'center' ? "bg-luxury-gold/20" : ""}
        >
          <AlignCenter className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onBlockStyleChange(block.id, 'align', 'right')}
          className={block.style?.align === 'right' ? "bg-luxury-gold/20" : ""}
        >
          <AlignRight className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onBlockStyleChange(block.id, 'align', 'justify')}
          className={block.style?.align === 'justify' ? "bg-luxury-gold/20" : ""}
        >
          <AlignJustify className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex border rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onFormatSelection('fontWeight', 'bold')}
          title="Bold (select text first)"
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onFormatSelection('fontStyle', 'italic')}
          title="Italic (select text first)"
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onFormatSelection('textDecoration', 'underline')}
          title="Underline (select text first)"
        >
          <Underline className="h-3 w-3" />
        </Button>
      </div>
      
      <select
        value={block.style?.fontSize || 'text-base'}
        onChange={(e) => onBlockStyleChange(block.id, 'fontSize', e.target.value)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      >
        {FONT_SIZES.map(size => (
          <option key={size.value} value={size.value}>{size.name}</option>
        ))}
      </select>
      
      <select
        value={block.style?.color || '#121212'}
        onChange={(e) => onBlockStyleChange(block.id, 'color', e.target.value)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      >
        {TEXT_COLORS.map(color => (
          <option key={color.value} value={color.value}>{color.name}</option>
        ))}
      </select>
    </div>
  );
};

interface BlockPreviewProps {
  block: BlogContentBlock;
  formatTextForPreview: (content: string) => React.ReactNode;
}

const BlockPreview: React.FC<BlockPreviewProps> = ({ block, formatTextForPreview }) => {
  return (
    <div
      className={cn(
        block.style?.fontSize || 'text-base',
        block.style?.align ? `text-${block.style.align}` : 'text-left',
      )}
      style={{ color: block.style?.color || '#121212' }}
    >
      {block.type === 'image' ? (
        <img src={block.content} alt="Preview" className="max-h-32 object-contain" />
      ) : block.type === 'list' ? (
        <ul className="list-disc pl-5">
          {block.content.split('\n').map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <div dangerouslySetInnerHTML={{ 
          __html: block.content
            .replace(/\n/g, '<br />')
            .replace(/<strong>(.*?)<\/strong>/g, '<span class="font-bold">$1</span>')
            .replace(/<em>(.*?)<\/em>/g, '<span class="italic">$1</span>')
            .replace(/<u>(.*?)<\/u>/g, '<span class="underline">$1</span>')
        }} />
      )}
    </div>
  );
};

export default ContentBlock;
