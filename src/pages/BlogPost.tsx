
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category: string;
  created_at: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBlogPost();
  }, [id]);
  
  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      
      // Fetch the current blog post
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setPost(data);
      
      // Fetch related posts (same category, excluding current post)
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(3);
          
        if (relatedError) throw relatedError;
        setRelatedPosts(relatedData || []);
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive"
      });
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
            <div className="animate-pulse">Loading article...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p className="mb-8">The article you're looking for doesn't seem to exist.</p>
            <Button asChild>
              <Link to="/blog">Return to Blog</Link>
            </Button>
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
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <div className="relative h-[40vh] rounded-lg overflow-hidden mb-8">
            <img 
              src={post.image_url || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <div className="text-luxury-khaki text-sm mb-2">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • By Josh Rader
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{post.title}</h1>
              </div>
            </div>
          </div>
          
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
        
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Continue Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link 
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`} 
                  className="group block luxury-card overflow-hidden hover:shadow-lg"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedPost.image_url || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-luxury-gray">
                      {new Date(relatedPost.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <h3 className="font-semibold mt-1 group-hover:text-luxury-gold transition-colors">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
