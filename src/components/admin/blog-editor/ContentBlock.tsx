
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BlogContentBlock } from "@/types/blog";
import { Code, Trash2 } from "lucide-react";

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
      <div className="flex justify-end items-center mb-2">
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
              id={`editor-${block.id}`}
              ref={editorRef}
              className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-luxury-gold overflow-auto"
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
    </div>
  );
};

export default ContentBlock;
