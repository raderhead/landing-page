
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";
import { BlogPost, BlogContentBlock, BLOG_CATEGORIES } from '@/types/blog';
import ImageUpload from './ImageUpload';
import ContentBlockList from './ContentBlockList';

interface BlogEditorFormProps {
  currentBlog: Partial<BlogPost>;
  setCurrentBlog: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  onSave: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

const BlogEditorForm: React.FC<BlogEditorFormProps> = ({
  currentBlog,
  setCurrentBlog,
  onSave,
  onCancel
}) => {
  const [contentBlocks, setContentBlocks] = useState<BlogContentBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});
  
  useEffect(() => {
    if (currentBlog.formattedContent && currentBlog.formattedContent.length > 0) {
      setContentBlocks(currentBlog.formattedContent);
    } else if (currentBlog.content) {
      const initialBlock: BlogContentBlock = {
        id: uuidv4(),
        type: 'paragraph',
        content: currentBlog.content,
        style: {
          fontSize: 'text-base',
          align: 'left',
        }
      };
      setContentBlocks([initialBlock]);
    } else {
      const emptyBlock: BlogContentBlock = {
        id: uuidv4(),
        type: 'paragraph',
        content: '',
        style: {
          fontSize: 'text-base',
          align: 'left',
        }
      };
      setContentBlocks([emptyBlock]);
    }
  }, [currentBlog.formattedContent, currentBlog.content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBlog({
      ...currentBlog,
      [name]: value
    });
  };

  const handleContentBlockChange = (id: string, content: string) => {
    setContentBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const handleBlockStyleChange = (id: string, styleProp: string, value: string) => {
    setContentBlocks(blocks => 
      blocks.map(block => 
        block.id === id ? { 
          ...block, 
          style: { 
            ...block.style,
            [styleProp]: value 
          } 
        } : block
      )
    );
  };

  const handleBlockTypeChange = (id: string, newType: BlogContentBlock['type']) => {
    setContentBlocks(blocks => 
      blocks.map(block => {
        if (block.id === id) {
          let updatedStyle = { ...block.style };
          if (newType === 'heading') {
            updatedStyle.fontSize = 'text-2xl';
            updatedStyle.fontWeight = 'bold';
          }
          
          return { 
            ...block, 
            type: newType,
            style: updatedStyle
          };
        }
        return block;
      })
    );
  };

  const addContentBlock = (type: BlogContentBlock['type'] = 'paragraph') => {
    const newBlock: BlogContentBlock = {
      id: uuidv4(),
      type,
      content: '',
      style: {
        fontSize: 'text-base',
        align: 'left',
      }
    };
    
    setContentBlocks([...contentBlocks, newBlock]);
    setTimeout(() => {
      setActiveBlockId(newBlock.id);
      const newBlockElement = document.getElementById(`block-${newBlock.id}`);
      if (newBlockElement) {
        newBlockElement.focus();
      }
    }, 10);
  };

  const removeContentBlock = (id: string) => {
    if (contentBlocks.length <= 1) {
      return;
    }
    
    setContentBlocks(blocks => blocks.filter(block => block.id !== id));
  };

  const applyFormatToSelection = (id: string, formatType: string, formatValue: string) => {
    const textarea = textareaRefs.current[id];

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      toast({ title: "Please select some text first." });
      return;
    }
    
    // Get the content block
    const block = contentBlocks.find(b => b.id === id);
    if (!block) return;
    
    // Extract content parts
    const contentBefore = block.content.substring(0, start);
    const selectedText = block.content.substring(start, end);
    const contentAfter = block.content.substring(end);
    
    // Format the selected text
    let formattedText = selectedText;
    
    if (formatType === 'fontWeight' && formatValue === 'bold') {
      formattedText = `<strong>${selectedText}</strong>`;
    } else if (formatType === 'fontStyle' && formatValue === 'italic') {
      formattedText = `<em>${selectedText}</em>`;
    } else if (formatType === 'textDecoration' && formatValue === 'underline') {
      formattedText = `<u>${selectedText}</u>`;
    }
    
    // Combine the parts
    const newContent = contentBefore + formattedText + contentAfter;
    
    // Update the content block
    handleContentBlockChange(id, newContent);
    
    // Set focus back to the textarea and position cursor after the formatted text
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          contentBefore.length + formattedText.length, 
          contentBefore.length + formattedText.length
        );
      }
    }, 0);
  };

  const formatTextForPreview = (content: string) => {
    if (!content) return null;

    let formattedContent = content
      .replace(/<strong>(.*?)<\/strong>/g, '<span class="font-bold">$1</span>')
      .replace(/<em>(.*?)<\/em>/g, '<span class="italic">$1</span>')
      .replace(/<u>(.*?)<\/u>/g, '<span class="underline">$1</span>');
    
    const elementsWithLineBreaks = formattedContent.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ __html: line }} />
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
    
    return elementsWithLineBreaks;
  };

  const handleImageChange = (url: string) => {
    setCurrentBlog({
      ...currentBlog,
      image_url: url
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentBlog(prev => ({
      ...prev,
      formattedContent: contentBlocks
    }));
    
    await onSave(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
        <Input
          id="title"
          name="title"
          placeholder="Enter blog title"
          value={currentBlog.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
        <select
          id="category"
          name="category"
          value={currentBlog.category}
          onChange={handleInputChange}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          {BLOG_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt/Summary</label>
        <Textarea
          id="excerpt"
          name="excerpt"
          placeholder="Enter a short summary"
          value={currentBlog.excerpt}
          onChange={handleInputChange}
          required
          rows={3}
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
        <ContentBlockList
          contentBlocks={contentBlocks}
          activeBlockId={activeBlockId}
          onContentBlockChange={handleContentBlockChange}
          onBlockStyleChange={handleBlockStyleChange}
          onBlockTypeChange={handleBlockTypeChange}
          removeContentBlock={removeContentBlock}
          addContentBlock={() => addContentBlock()}
          setActiveBlockId={setActiveBlockId}
          applyFormatToSelection={applyFormatToSelection}
          formatTextForPreview={formatTextForPreview}
          textareaRefs={textareaRefs}
        />
      </div>
      
      <ImageUpload 
        imageUrl={currentBlog.image_url}
        onImageChange={handleImageChange}
      />
      
      <div className="flex gap-4">
        <Button
          type="submit"
          className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
        >
          <Save className="mr-2 h-4 w-4" /> Save Blog Post
        </Button>
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BlogEditorForm;
