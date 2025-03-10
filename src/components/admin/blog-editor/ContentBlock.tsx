
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BlogContentBlock, TEXT_COLORS, FONT_SIZES, TEXT_ALIGNMENTS } from "@/types/blog";
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, 
  Italic, Type, Quote, List, FileImage, Underline, Trash2, Code
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
  const [showCodeView, setShowCodeView] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Convert HTML content to plain text with formatting
  const stripTags = (htmlContent: string): string => {
    return htmlContent
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<em>(.*?)<\/em>/g, '$1')
      .replace(/<u>(.*?)<\/u>/g, '$1')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<div>/g, '')
      .replace(/<\/div>/g, '\n')
      .replace(/&nbsp;/g, ' ');
  };
  
  // Add HTML formatting based on content
  const addFormattingTags = (content: string): string => {
    let processedContent = content;
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.startContainer.parentElement?.classList.contains('font-bold')) {
        processedContent = `<strong>${processedContent}</strong>`;
      }
      if (range.startContainer.parentElement?.classList.contains('italic')) {
        processedContent = `<em>${processedContent}</em>`;
      }
      if (range.startContainer.parentElement?.classList.contains('underline')) {
        processedContent = `<u>${processedContent}</u>`;
      }
    }
    
    return processedContent;
  };

  // Handle format commands (bold, italic, underline)
  const handleFormatCommand = (command: string) => {
    if (!editorRef.current) return;
    
    document.execCommand(command, false);
    
    // Store the formatted HTML
    const formattedHtml = editorRef.current.innerHTML;
    
    // Convert the formatted HTML to our storage format
    let storedContent = formattedHtml
      .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
      .replace(/<div><br><\/div>/g, '<br>')
      .replace(/<div>/g, '<br>')
      .replace(/<\/div>/g, '')
      .replace(/^\s*<br>/g, ''); // Remove leading <br>
      
    // Ensure paragraphs have proper formatting
    if (block.type === 'paragraph' && !storedContent.startsWith('<p>')) {
      storedContent = `<p>${storedContent}</p>`;
    }
    
    onContentChange(block.id, storedContent);
  };
  
  // Initialize the editor content
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Only set innerHTML if it's different to avoid cursor jumping
    const displayHtml = showCodeView 
      ? block.content 
      : block.content
          .replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>')
          .replace(/<em>(.*?)<\/em>/g, '<i>$1</i>')
          .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
          .replace(/<p>(.*?)<\/p>/g, '$1')
          .replace(/<br\s*\/?>/g, '<div><br></div>');
          
    if (editorRef.current.innerHTML !== displayHtml) {
      editorRef.current.innerHTML = displayHtml;
    }
  }, [block.content, showCodeView]);

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
            onClick={() => setShowCodeView(!showCodeView)}
            className={showCodeView ? "bg-muted" : ""}
            title={showCodeView ? "Show visual editor" : "Show HTML code"}
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
          {showCodeView ? (
            <textarea
              ref={textareaRef}
              value={block.content}
              onChange={(e) => onContentChange(block.id, e.target.value)}
              className="w-full min-h-[150px] p-3 border rounded-md font-mono text-sm"
              placeholder="HTML content"
            />
          ) : (
            <div
              ref={editorRef}
              className={cn(
                "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-luxury-gold overflow-auto",
                block.style?.fontSize || 'text-base',
                block.style?.align ? `text-${block.style.align}` : 'text-left',
              )}
              style={{ color: block.style?.color || '#121212' }}
              contentEditable
              suppressContentEditableWarning
              onInput={() => {
                if (editorRef.current) {
                  onContentChange(block.id, editorRef.current.innerHTML
                    .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
                    .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
                    .replace(/<div><br><\/div>/g, '<br>')
                    .replace(/<div>/g, '<br>')
                    .replace(/<\/div>/g, '')
                  );
                }
              }}
              onFocus={() => onSetActiveBlock(block.id)}
            />
          )}
        </div>
      )}
      
      <FormatToolbar 
        block={block}
        onBlockStyleChange={onBlockStyleChange}
        onFormatCommand={handleFormatCommand}
        showCodeView={showCodeView}
      />
    </div>
  );
};

interface FormatToolbarProps {
  block: BlogContentBlock;
  onBlockStyleChange: (id: string, styleProp: string, value: string) => void;
  onFormatCommand: (command: string) => void;
  showCodeView: boolean;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({ 
  block, 
  onBlockStyleChange,
  onFormatCommand,
  showCodeView
}) => {
  if (showCodeView) return null;
  
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
          onClick={() => onFormatCommand('bold')}
          title="Bold text"
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onFormatCommand('italic')}
          title="Italic text"
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onFormatCommand('underline')}
          title="Underline text"
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

export default ContentBlock;
