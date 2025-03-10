
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BlogPost } from '@/types/blog';
import BlogEditorForm from './blog-editor/BlogEditorForm';

interface BlogEditorProps {
  currentBlog: Partial<BlogPost>;
  setCurrentBlog: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  onSave: () => void;
  onCancel: () => void;
  userId: string;
}

const BlogEditor = ({ currentBlog, setCurrentBlog, onSave, onCancel, userId }: BlogEditorProps) => {
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Fetch the session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      console.log("Current session:", data.session);
    };
    
    fetchSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      console.log("Auth state changed:", event, newSession?.user?.id);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Basic validation
      if (!currentBlog.title || !currentBlog.excerpt || !currentBlog.formattedContent || !currentBlog.category) {
        throw new Error("Please fill all required fields");
      }
      
      // Ensure the user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData.session;
      
      if (!currentSession) {
        throw new Error("You must be logged in to save blog posts");
      }
      
      const currentUserId = currentSession.user.id;
      console.log("Current user ID for saving:", currentUserId);
      
      if (!currentUserId) {
        throw new Error("Unable to identify current user");
      }
      
      const processedBlocks = currentBlog.formattedContent.map(block => {
        let processedContent = block.content;
        return {
          ...block,
          content: processedContent
        };
      });
      
      const htmlContent = processedBlocks.map(block => {
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
      
      // Log the data being saved to help with debugging
      console.log('Saving blog with data:', {
        id: currentBlog.id,
        title: currentBlog.title,
        excerpt: currentBlog.excerpt,
        content: htmlContent,
        blocksCount: processedBlocks.length,
        author_id: currentUserId // Use the current session user ID
      });
      
      if (currentBlog.id) {
        // For existing blogs, use upsert instead of update to ensure complete replacement
        const { data, error } = await supabase
          .from('blog_posts')
          .upsert({
            id: currentBlog.id,
            title: currentBlog.title,
            excerpt: currentBlog.excerpt,
            content: htmlContent,
            formattedContent: processedBlocks,
            image_url: currentBlog.image_url,
            category: currentBlog.category,
            updated_at: new Date().toISOString(),
            author_id: currentUserId // Use the current session user ID
          });
          
        if (error) {
          console.error("Error during upsert:", error);
          throw error;
        }
        
        console.log("Upsert response:", data);
        
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title: currentBlog.title,
            excerpt: currentBlog.excerpt,
            content: htmlContent,
            formattedContent: processedBlocks,
            image_url: currentBlog.image_url,
            category: currentBlog.category,
            author_id: currentUserId // Use the current session user ID
          });
          
        if (error) {
          console.error("Error during insert:", error);
          throw error;
        }
        
        console.log("Insert response:", data);
        
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }
      
      onSave();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Error saving blog",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="luxury-card p-8 mb-8">
      <h2 className="text-xl font-bold mb-6">
        {currentBlog.id ? "Edit Blog Post" : "Create New Blog Post"}
      </h2>
      <BlogEditorForm
        currentBlog={currentBlog}
        setCurrentBlog={setCurrentBlog}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default BlogEditor;
