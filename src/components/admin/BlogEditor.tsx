
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Image, Save, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Type, Quote, List, FileImage } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { BlogPost, BlogContentBlock, TEXT_COLORS, FONT_SIZES, TEXT_ALIGNMENTS } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogEditorProps {
  currentBlog: Partial<BlogPost>;
  setCurrentBlog: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  onSave: () => void;
  onCancel: () => void;
  userId: string;
}

const BlogEditor = ({ currentBlog, setCurrentBlog, onSave, onCancel, userId }: BlogEditorProps) => {
  const [uploading, setUploading] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<BlogContentBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  
  const categories = [
    "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
  ];

  useEffect(() => {
    // Initialize content blocks from existing formattedContent or create a default paragraph
    if (currentBlog.formattedContent && currentBlog.formattedContent.length > 0) {
      setContentBlocks(currentBlog.formattedContent);
    } else if (currentBlog.content) {
      // Create initial block from content
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
      // Create empty paragraph
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBlog({
      ...currentBlog,
      [name]: value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
        
      setCurrentBlog({
        ...currentBlog,
        image_url: data.publicUrl
      });
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleContentBlockChange = (id: string, content: string) => {
    setContentBlocks(blocks => 
      blocks.map(block => 
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
      blocks.map(block => 
        block.id === id ? { ...block, type: newType } : block
      )
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
    // Focus the new block
    setTimeout(() => {
      setActiveBlockId(newBlock.id);
      const newBlockElement = document.getElementById(`block-${newBlock.id}`);
      if (newBlockElement) {
        newBlockElement.focus();
      }
    }, 10);
  };

  const removeContentBlock = (id: string) => {
    // Don't remove if it's the only block
    if (contentBlocks.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one content block",
        variant: "destructive"
      });
      return;
    }
    
    setContentBlocks(blocks => blocks.filter(block => block.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentBlog.title || !currentBlog.excerpt || contentBlocks.length === 0 || !currentBlog.category) {
        throw new Error("Please fill all required fields");
      }
      
      // Generate HTML content from blocks for backward compatibility
      const htmlContent = contentBlocks.map(block => {
        switch(block.type) {
          case 'heading':
            return `<h3>${block.content}</h3>`;
          case 'paragraph':
            return `<p>${block.content}</p>`;
          case 'quote':
            return `<blockquote>${block.content}</blockquote>`;
          case 'list':
            return `<ul>${block.content.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>`;
          case 'image':
            return `<img src="${block.content}" alt="Blog content" class="w-full rounded" />`;
          default:
            return `<p>${block.content}</p>`;
        }
      }).join('\n\n');
      
      if (currentBlog.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: currentBlog.title,
            excerpt: currentBlog.excerpt,
            content: htmlContent,
            formattedContent: contentBlocks,
            image_url: currentBlog.image_url,
            category: currentBlog.category,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentBlog.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: currentBlog.title,
            excerpt: currentBlog.excerpt,
            content: htmlContent,
            formattedContent: contentBlocks,
            image_url: currentBlog.image_url,
            category: currentBlog.category,
            author_id: userId
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Error saving blog",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="luxury-card p-8 mb-8">
      <h2 className="text-xl font-bold mb-6">
        {currentBlog.id ? "Edit Blog Post" : "Create New Blog Post"}
      </h2>
      <form onSubmit={handleSave} className="space-y-6">
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
            {categories.map(category => (
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
          <div className="border border-input rounded-md p-4 space-y-4">
            {contentBlocks.map((block, index) => (
              <div 
                key={block.id} 
                className={cn(
                  "relative border border-input rounded-md p-3 space-y-2", 
                  activeBlockId === block.id ? "border-luxury-gold" : ""
                )}
                onClick={() => setActiveBlockId(block.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockTypeChange(block.id, 'paragraph')}
                      className={block.type === 'paragraph' ? "bg-luxury-gold/20" : ""}
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockTypeChange(block.id, 'heading')}
                      className={block.type === 'heading' ? "bg-luxury-gold/20" : ""}
                    >
                      <span className="font-bold">H</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockTypeChange(block.id, 'quote')}
                      className={block.type === 'quote' ? "bg-luxury-gold/20" : ""}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockTypeChange(block.id, 'list')}
                      className={block.type === 'list' ? "bg-luxury-gold/20" : ""}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockTypeChange(block.id, 'image')}
                      className={block.type === 'image' ? "bg-luxury-gold/20" : ""}
                    >
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContentBlock(block.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {block.type === 'image' ? (
                  <Input
                    id={`block-${block.id}`}
                    value={block.content || ''}
                    onChange={(e) => handleContentBlockChange(block.id, e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full"
                  />
                ) : (
                  <Textarea
                    id={`block-${block.id}`}
                    value={block.content || ''}
                    onChange={(e) => handleContentBlockChange(block.id, e.target.value)}
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
                )}
                
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Text alignment controls */}
                  <div className="flex border rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockStyleChange(block.id, 'align', 'left')}
                      className={block.style?.align === 'left' ? "bg-luxury-gold/20" : ""}
                    >
                      <AlignLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockStyleChange(block.id, 'align', 'center')}
                      className={block.style?.align === 'center' ? "bg-luxury-gold/20" : ""}
                    >
                      <AlignCenter className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockStyleChange(block.id, 'align', 'right')}
                      className={block.style?.align === 'right' ? "bg-luxury-gold/20" : ""}
                    >
                      <AlignRight className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockStyleChange(block.id, 'align', 'justify')}
                      className={block.style?.align === 'justify' ? "bg-luxury-gold/20" : ""}
                    >
                      <AlignJustify className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Font style controls */}
                  <div className="flex border rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockStyleChange(
                        block.id, 
                        'fontWeight', 
                        block.style?.fontWeight === 'bold' ? '' : 'bold'
                      )}
                      className={block.style?.fontWeight === 'bold' ? "bg-luxury-gold/20" : ""}
                    >
                      <Bold className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockStyleChange(
                        block.id, 
                        'fontStyle', 
                        block.style?.fontStyle === 'italic' ? '' : 'italic'
                      )}
                      className={block.style?.fontStyle === 'italic' ? "bg-luxury-gold/20" : ""}
                    >
                      <Italic className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Font size selector */}
                  <select
                    value={block.style?.fontSize || 'text-base'}
                    onChange={(e) => handleBlockStyleChange(block.id, 'fontSize', e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {FONT_SIZES.map(size => (
                      <option key={size.value} value={size.value}>{size.name}</option>
                    ))}
                  </select>
                  
                  {/* Text color selector */}
                  <select
                    value={block.style?.color || '#121212'}
                    onChange={(e) => handleBlockStyleChange(block.id, 'color', e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {TEXT_COLORS.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Preview of the content */}
                {block.content && (
                  <div className="mt-2 p-2 border rounded-md bg-muted">
                    <div className="text-xs text-luxury-slate mb-1">Preview:</div>
                    <div
                      className={cn(
                        block.style?.fontSize || 'text-base',
                        block.style?.align ? `text-${block.style.align}` : 'text-left',
                        block.style?.fontWeight === 'bold' ? 'font-bold' : '',
                        block.style?.fontStyle === 'italic' ? 'italic' : '',
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
                        block.content
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => addContentBlock()}
                className="text-luxury-gold border-luxury-gold/50 hover:bg-luxury-gold/10"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Content Block
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">Featured Image</label>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <div className="relative">
                <Input
                  id="image_url"
                  name="image_url"
                  placeholder="Enter image URL or upload"
                  value={currentBlog.image_url}
                  onChange={handleInputChange}
                  className="pl-10"
                />
                <Image className="absolute left-3 top-2.5 h-5 w-5 text-luxury-khaki" />
              </div>
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-luxury-gold hover:text-luxury-khaki transition-colors">
                    <Image className="h-4 w-4" />
                    <span>Upload new image</span>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
                {uploading && <p className="text-xs mt-1">Uploading...</p>}
              </div>
            </div>
            
            {currentBlog.image_url && (
              <div className="w-32 h-32 border rounded overflow-hidden flex-shrink-0">
                <img
                  src={currentBlog.image_url}
                  alt="Blog preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
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
    </div>
  );
};

export default BlogEditor;
