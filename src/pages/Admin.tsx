
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Plus, FileText } from "lucide-react";
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
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setBlogs(blogs.filter(blog => blog.id !== id));
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Error deleting blog",
        description: error.message,
        variant: "destructive"
      });
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
      <div className="min-h-screen bg-background admin-container">
        <Navbar />
        <div className="container py-20">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
              <FileText className="h-5 w-5" />
              <span className="text-base">Loading blog management...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background admin-container">
      <Navbar />
      <main className="container py-16 max-w-5xl">
        <div className="mb-8">
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm admin-title-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1 font-serif">Blog Management</h1>
                <p className="text-muted-foreground text-sm font-sans">Create and manage your blog content</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {!isEditing ? (
                  <Button 
                    onClick={handleNewBlog}
                    size="sm"
                    className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" /> New Post
                  </Button>
                ) : null}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-luxury-khaki/50 text-luxury-slate hover:bg-luxury-khaki/10"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-md border border-luxury-khaki/20 overflow-hidden mb-10">
            <div className="border-b border-luxury-khaki/10 bg-luxury-cream/50 px-4 py-3 flex items-center">
              <h2 className="font-medium text-luxury-slate">
                {currentBlog.id ? 'Edit Post' : 'Create New Post'}
              </h2>
            </div>
            <BlogEditor 
              currentBlog={currentBlog}
              setCurrentBlog={setCurrentBlog}
              onSave={handleSaveComplete}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        <div className="bg-luxury-khaki/10 p-6 rounded-lg">
          <BlogList 
            blogs={blogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
