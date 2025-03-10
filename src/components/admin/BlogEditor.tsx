
import React, { useState, useEffect } from 'react';
import { supabase, getCurrentSession, getCurrentUserId } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BlogPost } from '@/types/blog';
import BlogEditorForm from './blog-editor/BlogEditorForm';

interface BlogEditorProps {
  currentBlog: Partial<BlogPost>;
  setCurrentBlog: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  onSave: () => void;
  onCancel: () => void;
  userId?: string; // Make userId optional since we're getting it directly
}

const BlogEditor = ({ currentBlog, setCurrentBlog, onSave, onCancel }: BlogEditorProps) => {
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch the session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getCurrentSession();
        setSession(sessionData);
        console.log("Current session loaded:", sessionData?.user?.id);
        setAuthChecked(true);
      } catch (error) {
        console.error("Error loading session:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue.",
          variant: "destructive"
        });
        setAuthChecked(true);
      }
    };
    
    fetchSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event);
      setSession(newSession);
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
      
      // Get the current user ID - this will throw if not authenticated
      const currentUserId = await getCurrentUserId();
      console.log("Current user ID for saving:", currentUserId);
      
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
        author_id: currentUserId
      });
      
      if (currentBlog.id) {
        // Check if the current user is authorized to update this blog post
        const { data: blogCheck, error: blogCheckError } = await supabase
          .from('blog_posts')
          .select('author_id')
          .eq('id', currentBlog.id)
          .single();
        
        if (blogCheckError) {
          console.error("Error checking blog ownership:", blogCheckError);
          // If the error is not "no rows found", it's a real error
          if (blogCheckError.code !== 'PGRST116') {
            throw new Error(`Cannot verify blog ownership: ${blogCheckError.message}`);
          }
        }
        
        if (blogCheck && blogCheck.author_id !== currentUserId) {
          console.error("Author ID mismatch:", { 
            currentUserId, 
            blogAuthorId: blogCheck.author_id 
          });
          throw new Error("You don't have permission to edit this blog post");
        }
        
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
            author_id: currentUserId
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
            author_id: currentUserId
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

  // Show authentication warning if needed
  if (authChecked && !session) {
    return (
      <div className="luxury-card p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-red-600">Authentication Required</h2>
        <p>You must be logged in to edit blog posts. Please sign in to continue.</p>
      </div>
    );
  }

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
