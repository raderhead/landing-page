
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogList from "@/components/admin/BlogList";
import BlogEditor from "@/components/admin/BlogEditor";
import WebhookTester from "@/components/admin/WebhookTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentBlog, setCurrentBlog] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching blogs:", error);
          toast({
            title: "Error",
            description: "Failed to load blog posts",
            variant: "destructive"
          });
        } else {
          setBlogs(data || []);
        }
      }
    };
    
    fetchBlogs();
  }, [session]);
  
  const handleEditBlog = (blog: any) => {
    setCurrentBlog(blog);
  };
  
  const handleDeleteBlog = async (blogId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', blogId);
      
      if (error) throw error;
      
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
      
      if (currentBlog && currentBlog.id === blogId) {
        setCurrentBlog(null);
      }
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveBlog = async (blogData: any) => {
    try {
      let response;
      
      if (blogData.id) {
        // Update existing blog
        response = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', blogData.id)
          .select();
      } else {
        // Insert new blog
        response = await supabase
          .from('blog_posts')
          .insert({
            ...blogData,
            author_id: session.user.id,
          })
          .select();
      }
      
      if (response.error) throw response.error;
      
      // Refresh blog list
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBlogs(data || []);
      setCurrentBlog(null);
      
      toast({
        title: "Success",
        description: blogData.id ? "Blog post updated successfully" : "Blog post created successfully",
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      });
    }
  };
  
  const handleCancelEdit = () => {
    setCurrentBlog(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-luxury-gold"></div>
      </div>
    );
  }
  
  if (!session) {
    return null; // Will redirect to /auth
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-luxury-black text-white">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold text-white/90 mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="blogs" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blogs">
            <div className="grid grid-cols-1 gap-8">
              <BlogList 
                blogs={blogs} 
                onEdit={handleEditBlog} 
                onDelete={handleDeleteBlog} 
              />
              <BlogEditor 
                currentBlog={currentBlog} 
                setCurrentBlog={setCurrentBlog} 
                onSave={(e) => handleSaveBlog(currentBlog)}
                onCancel={handleCancelEdit} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="properties">
            <div className="grid grid-cols-1 gap-8">
              <WebhookTester />
              
              <Card>
                <CardHeader>
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>
                    Manage your property listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-luxury-khaki">
                    Properties are added via the webhook. Use the tester above to add sample properties,
                    or integrate with your property management system using the webhook endpoint.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Configure your site settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-luxury-khaki">Settings management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
