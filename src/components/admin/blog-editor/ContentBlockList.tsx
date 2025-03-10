
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

  const handleAlignParagraph = (alignment: string) => {
    if (!activeBlockId) return;
    
    // Get the currently selected text or cursor position
    const selection = window.getSelection();
    if (!selection) return;
    
    const editorElement = document.getElementById(`editor-${activeBlockId}`);
    if (!editorElement) return;
    
    document.execCommand('formatBlock', false, '<p>');
    
    switch(alignment) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
      case 'justify':
        document.execCommand('justifyFull', false);
        break;
    }
    
    // Store the updated HTML
    const formattedHtml = editorElement.innerHTML
      .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
      .replace(/<div><br><\/div>/g, '<br>')
      .replace(/<div>/g, '<br>')
      .replace(/<\/div>/g, '')
      .replace(/^\s*<br>/g, '');
      
    onContentBlockChange(activeBlockId, formattedHtml);
  };

  const handleTextColor = (color: string) => {
    if (!activeBlockId) return;
    
    // Save the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    
    document.execCommand('foreColor', false, color);
    
    // Store the formatted HTML
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
      
      // Restore selection
      setTimeout(() => {
        selection.removeAllRanges();
        selection.addRange(range);
      }, 10);
    }
  };

  const handleFontSize = (fontSize: string) => {
    if (!activeBlockId) return;
    
    // Get the selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0).cloneRange(); // Clone the range to restore later
    if (range.collapsed) return; // No text selected
    
    // Store start and end points to restore selection
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    
    // Instead of surroundContents which can cause errors with complex selections,
    // use execCommand with fontSize and then apply classes with JavaScript
    document.execCommand('fontSize', false, '7'); // Use a temporary size
    
    // Now find all font elements with size 7 and replace them with spans
    const editorElement = document.getElementById(`editor-${activeBlockId}`);
    if (editorElement) {
      const fontElements = editorElement.querySelectorAll('font[size="7"]');
      fontElements.forEach(element => {
        const span = document.createElement('span');
        span.className = fontSize;
        span.innerHTML = element.innerHTML;
        element.parentNode?.replaceChild(span, element);
      });
      
      // Store the formatted HTML
      const formattedHtml = editorElement.innerHTML
        .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
        .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
        .replace(/<div><br><\/div>/g, '<br>')
        .replace(/<div>/g, '<br>')
        .replace(/<\/div>/g, '')
        .replace(/^\s*<br>/g, '');
        
      onContentBlockChange(activeBlockId, formattedHtml);
      
      // Restore selection
      setTimeout(() => {
        try {
          const newRange = document.createRange();
          newRange.setStart(startContainer, startOffset);
          newRange.setEnd(endContainer, endOffset);
          
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (error) {
          console.log("Couldn't restore selection exactly, but the formatting was applied");
        }
      }, 10);
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
            onClick={() => handleAlignParagraph('left')}
            disabled={!activeBlockId}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAlignParagraph('center')}
            disabled={!activeBlockId}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAlignParagraph('right')}
            disabled={!activeBlockId}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAlignParagraph('justify')}
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
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleFontSize(e.target.value);
              e.target.value = ""; // Reset after selection
            }
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={!activeBlockId}
        >
          <option value="">Font Size</option>
          {FONT_SIZES.map(size => (
            <option key={size.value} value={size.value}>{size.name}</option>
          ))}
        </select>
        
        <div className="relative">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleTextColor(e.target.value);
                e.target.value = ""; // Reset after selection
              }
            }}
            className="h-9 rounded-md border border-input bg-background px-2 pr-8 text-sm appearance-none"
            disabled={!activeBlockId}
          >
            <option value="">Text Color</option>
            {TEXT_COLORS.map(color => (
              <option key={color.value} value={color.value}>{color.name}</option>
            ))}
          </select>
          
          {/* Color swatches preview */}
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-md shadow-md z-10 grid grid-cols-3 gap-1 w-48 hidden group-hover:block">
            {TEXT_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                className="w-14 h-10 rounded cursor-pointer flex flex-col items-center justify-center text-xs overflow-hidden"
                style={{ backgroundColor: color.value }}
                onClick={() => handleTextColor(color.value)}
                title={color.name}
              >
                <span className={`text-center ${color.value === '#FFFFFF' ? 'text-gray-800' : 'text-white'} font-semibold text-[10px] leading-tight`}>
                  {color.name}
                </span>
                <span className="block text-[9px]">{color.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color swatches display */}
      <div className="flex flex-wrap gap-2 mb-4 p-2 border rounded-md">
        <div className="text-xs font-medium text-muted-foreground mb-1 w-full">Available Colors:</div>
        <div className="flex flex-wrap gap-1">
          {TEXT_COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              className="w-10 h-10 rounded cursor-pointer flex flex-col items-center justify-center text-xs overflow-hidden relative group"
              style={{ backgroundColor: color.value }}
              onClick={() => handleTextColor(color.value)}
              title={`${color.name} (${color.value})`}
              disabled={!activeBlockId}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
            </button>
          ))}
        </div>
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
