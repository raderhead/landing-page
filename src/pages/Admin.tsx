
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogEditor from "@/components/admin/BlogEditor";
import BlogList from "@/components/admin/BlogList";
import { BlogPost, BlogContentBlock } from "@/types/blog";

const Admin = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Market Trends',
    image_url: '',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth');
        return;
      }
      
      setUser(data.session.user);
      fetchBlogs();
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (session) {
        setUser(session.user);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Cast the formattedContent properly
      const formattedBlogs: BlogPost[] = data ? data.map(blog => ({
        ...blog,
        formattedContent: blog.formattedContent as unknown as BlogContentBlock[] | null
      })) : [];
      
      setBlogs(formattedBlogs);
    } catch (error: any) {
      toast({
        title: "Error fetching blogs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleEdit = (blog: BlogPost) => {
    console.log("Editing blog:", blog);
    setCurrentBlog({...blog});
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Verify deletion
      const { data: checkData } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkData) {
        throw new Error("Failed to delete the blog post completely. Please try again.");
      }
      
      setBlogs(blogs.filter(blog => blog.id !== id));
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      // Re-fetch blogs to ensure data is in sync
      setTimeout(() => {
        fetchBlogs();
      }, 500);
      
    } catch (error: any) {
      toast({
        title: "Error deleting blog",
        description: error.message,
        variant: "destructive"
      });
      fetchBlogs();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComplete = () => {
    setIsEditing(false);
    setCurrentBlog({
      title: '',
      excerpt: '',
      content: '',
      category: 'Market Trends',
      image_url: '',
    });
    // Ensure we get the latest data after saving
    fetchBlogs();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentBlog({
      title: '',
      excerpt: '',
      content: '',
      category: 'Market Trends',
      image_url: '',
    });
  };

  const handleNewBlog = () => {
    setCurrentBlog({
      title: '',
      excerpt: '',
      content: '',
      category: 'Market Trends',
      image_url: '',
    });
    setIsEditing(true);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <div className="flex gap-4">
            {!isEditing ? (
              <Button 
                onClick={handleNewBlog}
                className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
              >
                <Plus className="mr-2 h-4 w-4" /> New Blog Post
              </Button>
            ) : null}
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-luxury-slate hover:text-luxury-black"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <BlogEditor 
            currentBlog={currentBlog}
            setCurrentBlog={setCurrentBlog}
            onSave={handleSaveComplete}
            onCancel={handleCancel}
            userId={user?.id}
          />
        ) : null}
        
        <BlogList 
          blogs={blogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
