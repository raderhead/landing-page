import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Pen, Trash2, LogOut, Plus, Image, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
};

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
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate();
  
  const categories = [
    "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
  ];

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
      setBlogs(data || []);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBlog({
      ...currentBlog,
      [name]: value
    });
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
            author_id: user.id
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }
      
      setIsEditing(false);
      setCurrentBlog({
        title: '',
        excerpt: '',
        content: '',
        category: 'Market Trends',
        image_url: '',
      });
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error saving blog",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setCurrentBlog(blog);
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

  if (loading) {
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
                onClick={() => {
                  setCurrentBlog({
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'Market Trends',
                    image_url: '',
                  });
                  setIsEditing(true);
                }}
                className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
              >
                <Plus className="mr-2 h-4 w-4" /> New Blog Post
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setCurrentBlog({
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'Market Trends',
                    image_url: '',
                  });
                }}
                variant="outline"
              >
                Cancel
              </Button>
            )}
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
              
              <Button
                type="submit"
                className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
              >
                <Save className="mr-2 h-4 w-4" /> Save Blog Post
              </Button>
            </form>
          </div>
        ) : null}
        
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Your Blog Posts</h2>
          
          {blogs.length === 0 ? (
            <div className="text-center py-12 luxury-card">
              <p className="text-luxury-slate">You haven't created any blog posts yet.</p>
            </div>
          ) : (
            blogs.map(blog => (
              <div key={blog.id} className="luxury-card p-6 flex flex-col md:flex-row gap-6">
                {blog.image_url && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="outline" className="border-luxury-khaki text-luxury-khaki mb-2">
                        {blog.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                        className="text-luxury-slate hover:text-luxury-black"
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        className="text-luxury-slate hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-luxury-gray mb-3 line-clamp-2">{blog.excerpt}</p>
                  <p className="text-sm text-luxury-slate">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
