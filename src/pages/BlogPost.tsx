
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { BlogPost as BlogPostType, BlogContentBlock } from '@/types/blog';
import { cn } from '@/lib/utils';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
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
      
      // Cast formattedContent properly
      setPost({
        ...data,
        formattedContent: data.formattedContent as unknown as BlogContentBlock[] | null
      });
      
      // Fetch related posts (same category, excluding current post)
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(3);
          
        if (relatedError) throw relatedError;
        
        // Cast formattedContent for related posts
        const formattedRelatedPosts = relatedData ? relatedData.map(blog => ({
          ...blog,
          formattedContent: blog.formattedContent as unknown as BlogContentBlock[] | null
        })) : [];
        
        setRelatedPosts(formattedRelatedPosts);
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

  // Function to safely strip HTML tags 
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Function to render content with preserved line breaks
  const renderContentWithLineBreaks = (content: string) => {
    if (!content) return null;
    
    // Remove HTML tags and split by \n to preserve line breaks
    const cleanContent = content
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<em>(.*?)<\/em>/g, '$1')
      .replace(/<u>(.*?)<\/u>/g, '$1');
    
    // Split by \n and wrap each line in spans with block display
    return cleanContent.split('\n').map((line, i) => (
      <span key={i} className="block">
        {line.length > 0 ? line : <br />}
      </span>
    ));
  };

  const renderFormattedContent = () => {
    if (!post) return null;
    
    // If we have formatted content blocks, render those
    if (post.formattedContent && post.formattedContent.length > 0) {
      return (
        <div className="space-y-6">
          {post.formattedContent.map((block: BlogContentBlock) => {
            const textAlign = block.style?.align ? `text-${block.style.align}` : '';
            const textColor = block.style?.color ? block.style.color : '';
            const fontSize = block.style?.fontSize || '';
            const fontWeight = block.style?.fontWeight ? `font-${block.style.fontWeight}` : '';
            const fontStyle = block.style?.fontStyle === 'italic' ? 'italic' : '';
            const textDecoration = block.style?.textDecoration === 'underline' ? 'underline' : '';
            
            const className = cn(
              textAlign,
              fontSize,
              fontWeight,
              fontStyle,
              textDecoration,
              "max-w-none leading-relaxed"
            );
            
            switch (block.type) {
              case 'heading':
                return (
                  <h2 
                    key={block.id}
                    className={cn("font-bold text-2xl my-4", className)}
                    style={{ color: textColor }}
                  >
                    {renderContentWithLineBreaks(block.content)}
                  </h2>
                );
              case 'paragraph':
                return (
                  <p 
                    key={block.id}
                    className={className}
                    style={{ color: textColor }}
                  >
                    {renderContentWithLineBreaks(block.content)}
                  </p>
                );
              case 'quote':
                return (
                  <blockquote 
                    key={block.id}
                    className={cn("border-l-4 border-luxury-gold pl-4 italic py-2", className)}
                    style={{ color: textColor }}
                  >
                    {renderContentWithLineBreaks(block.content)}
                  </blockquote>
                );
              case 'list':
                return (
                  <ul 
                    key={block.id}
                    className={cn("list-disc pl-5", className)}
                    style={{ color: textColor }}
                  >
                    {block.content.split('\n').map((item, i) => {
                      // Clean HTML tags from list items
                      const cleanItem = item
                        .replace(/<strong>(.*?)<\/strong>/g, '$1')
                        .replace(/<em>(.*?)<\/em>/g, '$1')
                        .replace(/<u>(.*?)<\/u>/g, '$1');
                      return <li key={i}>{cleanItem}</li>;
                    })}
                  </ul>
                );
              case 'image':
                return (
                  <div key={block.id} className="my-6">
                    <img 
                      src={block.content} 
                      alt="Blog content" 
                      className="w-full rounded-lg"
                    />
                  </div>
                );
              default:
                return (
                  <p 
                    key={block.id}
                    className={className}
                    style={{ color: textColor }}
                  >
                    {renderContentWithLineBreaks(block.content)}
                  </p>
                );
            }
          })}
        </div>
      );
    }
    
    // Fallback to regular HTML content if no formatted blocks
    return (
      <div 
        className="prose prose-lg max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    );
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
              src={post?.image_url || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} 
              alt={post?.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <div className="text-luxury-khaki text-sm mb-2">
                  {post && new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • By Josh Rader
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{post?.title}</h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-luxury-slate gap-4 mb-8 border-b border-luxury-khaki/20 pb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{post && new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Josh Rader</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post ? Math.ceil((stripHtml(post.content).length) / 1000) : 0} min read</span>
            </div>
          </div>
          
          <article className="max-w-4xl mx-auto">
            {renderFormattedContent()}
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
