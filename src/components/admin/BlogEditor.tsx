
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Image, Save } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
};

interface BlogEditorProps {
  currentBlog: Partial<BlogPost>;
  setCurrentBlog: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  onSave: () => void;
  onCancel: () => void;
  userId: string;
}

const BlogEditor = ({ currentBlog, setCurrentBlog, onSave, onCancel, userId }: BlogEditorProps) => {
  const [uploading, setUploading] = useState(false);
  
  const categories = [
    "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
  ];

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentBlog.title || !currentBlog.excerpt || !currentBlog.content || !currentBlog.category) {
        throw new Error("Please fill all required fields");
      }
      
      if (currentBlog.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: currentBlog.title,
            excerpt: currentBlog.excerpt,
            content: currentBlog.content,
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
            content: currentBlog.content,
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
          <Textarea
            id="content"
            name="content"
            placeholder="Enter blog content (HTML formatting supported)"
            value={currentBlog.content}
            onChange={handleInputChange}
            required
            rows={10}
            className="font-mono"
          />
          <p className="text-xs text-luxury-slate mt-1">
            HTML formatting supported: &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
          </p>
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
