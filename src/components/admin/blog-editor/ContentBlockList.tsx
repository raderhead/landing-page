
import React, { useState, useEffect } from 'react';
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
  const [currentFontSize, setCurrentFontSize] = useState("");
  
  useEffect(() => {
    const checkSelectionFormatting = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !activeBlockId) return;
      
      // Check if selection contains a span with font size class
      const range = selection.getRangeAt(0);
      let currentNode = range.startContainer;
      
      // Navigate up to find if we're inside a span with a font size class
      while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
        currentNode = currentNode.parentNode;
      }
      
      if (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode as Element;
        
        // Check for font size classes
        for (const size of FONT_SIZES) {
          if (element.classList.contains(size.value)) {
            setCurrentFontSize(size.value);
            return;
          }
        }
        
        // If we're here, check parent elements for font size classes
        let parent = element.parentElement;
        while (parent) {
          for (const size of FONT_SIZES) {
            if (parent.classList.contains(size.value)) {
              setCurrentFontSize(size.value);
              return;
            }
          }
          parent = parent.parentElement;
        }
      }
      
      // Reset if no font size found
      setCurrentFontSize("");
    };
    
    document.addEventListener('selectionchange', checkSelectionFormatting);
    
    // Initial check
    checkSelectionFormatting();
    
    return () => {
      document.removeEventListener('selectionchange', checkSelectionFormatting);
    };
  }, [activeBlockId]);

  const handleFormatCommand = (command: string) => {
    if (activeBlockId) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0).cloneRange();
      
      document.execCommand(command, false);
      
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
          
          try {
            setTimeout(() => {
              selection.removeAllRanges();
              selection.addRange(range);
            }, 10);
          } catch (e) {
            console.log("Could not restore exact selection");
          }
        }
      }
    }
  };

  const handleAlignParagraph = (alignment: string) => {
    if (!activeBlockId) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0).cloneRange();
    
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
    
    const formattedHtml = editorElement.innerHTML
      .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
      .replace(/<div><br><\/div>/g, '<br>')
      .replace(/<div>/g, '<br>')
      .replace(/<\/div>/g, '')
      .replace(/^\s*<br>/g, '');
      
    onContentBlockChange(activeBlockId, formattedHtml);
    
    try {
      setTimeout(() => {
        selection.removeAllRanges();
        selection.addRange(range);
      }, 10);
    } catch (e) {
      console.log("Could not restore exact selection");
    }
  };

  const handleTextColor = (color: string) => {
    if (!activeBlockId) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0).cloneRange();
    
    document.execCommand('foreColor', false, color);
    
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
      
      try {
        setTimeout(() => {
          selection.removeAllRanges();
          selection.addRange(range);
        }, 10);
      } catch (e) {
        console.log("Could not restore exact selection");
      }
    }
  };

  const handleFontSize = (fontSize: string) => {
    if (!activeBlockId) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0).cloneRange();
    if (range.collapsed) return; // No text selected
    
    const selectedContent = range.extractContents();
    const span = document.createElement('span');
    span.className = fontSize;
    span.appendChild(selectedContent);
    range.insertNode(span);
    
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
      
      try {
        setTimeout(() => {
          // Preserve selection after content change
          const newSelection = window.getSelection();
          if (newSelection) {
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            newSelection.removeAllRanges();
            newSelection.addRange(newRange);
            
            // Update current font size
            setCurrentFontSize(fontSize);
          }
        }, 10);
      } catch (e) {
        console.log("Could not restore selection", e);
      }
    }
  };

  return (
    <div className="border border-input rounded-md p-4 space-y-4">
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
          value={currentFontSize}
          onChange={(e) => {
            if (e.target.value) {
              handleFontSize(e.target.value);
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
