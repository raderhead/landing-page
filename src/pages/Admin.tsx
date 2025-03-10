import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Plus, Book, Pen } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-b from-white to-luxury-cream">
        <Navbar />
        <div className="container py-24">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse flex items-center gap-2 text-luxury-gold">
              <Book className="h-6 w-6 animate-bounce" />
              <span className="text-lg font-medium">Loading blog management...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-luxury-cream">
      <Navbar />
      <main className="container py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-luxury-black mb-2 flex items-center gap-3">
              <Pen className="h-8 w-8 text-luxury-gold" /> Blog Management
            </h1>
            <p className="text-luxury-gray">Create and manage your blog content</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {!isEditing ? (
              <Button 
                onClick={handleNewBlog}
                className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black font-medium px-6"
              >
                <Plus className="mr-2 h-4 w-4" /> New Blog Post
              </Button>
            ) : null}
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="text-luxury-slate hover:text-luxury-black border-luxury-slate/20 hover:border-luxury-black/40"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-lg border border-luxury-gold/10 overflow-hidden mb-12">
            <BlogEditor 
              currentBlog={currentBlog}
              setCurrentBlog={setCurrentBlog}
              onSave={handleSaveComplete}
              onCancel={handleCancel}
            />
          </div>
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
