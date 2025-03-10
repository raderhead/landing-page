import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { BlogPost as BlogPostType, BlogContentBlock } from '@/types/blog';
import { cn } from '@/lib/utils';
const BlogPost = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchBlogPost();
  }, [id]);
  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (error) throw error;
      setPost({
        ...data,
        formattedContent: data.formattedContent as unknown as BlogContentBlock[] | null
      });
      if (data) {
        const {
          data: relatedData,
          error: relatedError
        } = await supabase.from('blog_posts').select('*').eq('category', data.category).neq('id', id).limit(3);
        if (relatedError) throw relatedError;
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
  const generateShareUrls = () => {
    if (!post) return {
      twitter: '',
      facebook: '',
      linkedin: ''
    };
    const currentUrl = window.location.href;
    const title = encodeURIComponent(post.title);
    const url = encodeURIComponent(currentUrl);
    return {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied!",
        description: "Blog post URL has been copied to clipboard"
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    });
  };
  const renderFormattedContent = () => {
    if (!post) return null;
    if (post.formattedContent && post.formattedContent.length > 0) {
      return <div className="space-y-6">
          {post.formattedContent.map((block: BlogContentBlock) => {
          const textAlign = block.style?.align ? `text-${block.style.align}` : '';
          const textColor = block.style?.color ? block.style.color : '';
          const fontSize = block.style?.fontSize || '';
          const fontWeight = block.style?.fontWeight ? `font-${block.style.fontWeight}` : '';
          const fontStyle = block.style?.fontStyle === 'italic' ? 'italic' : '';
          const textDecoration = block.style?.textDecoration === 'underline' ? 'underline' : '';
          const className = cn(textAlign, fontSize, fontWeight, fontStyle, textDecoration, "max-w-none leading-relaxed");
          switch (block.type) {
            case 'heading':
              return <h2 key={block.id} className={cn("font-bold text-2xl my-4 text-luxury-black", className)} style={{
                color: textColor
              }} dangerouslySetInnerHTML={{
                __html: block.content
              }} />;
            case 'paragraph':
              return <div key={block.id} className={cn("text-luxury-slate", className)} style={{
                color: textColor
              }} dangerouslySetInnerHTML={{
                __html: block.content.replace(/\n/g, '<br>')
              }} />;
            case 'quote':
              return <blockquote key={block.id} className={cn("border-l-4 border-luxury-gold pl-4 italic py-2 text-luxury-slate bg-luxury-cream/50 rounded-r-md", className)} style={{
                color: textColor
              }} dangerouslySetInnerHTML={{
                __html: block.content.replace(/\n/g, '<br>')
              }} />;
            case 'list':
              return <ul key={block.id} className={cn("list-disc pl-5 text-luxury-slate", className)} style={{
                color: textColor
              }}>
                    {block.content.split('\n').map((item, i) => <li key={i} dangerouslySetInnerHTML={{
                  __html: item
                }} />)}
                  </ul>;
            case 'image':
              return <div key={block.id} className="my-6">
                    <img src={block.content} alt="Blog content" className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" />
                  </div>;
            default:
              return <div key={block.id} className={cn("text-luxury-slate", className)} style={{
                color: textColor
              }} dangerouslySetInnerHTML={{
                __html: block.content.replace(/\n/g, '<br>')
              }} />;
          }
        })}
        </div>;
    }
    return <div className="prose prose-lg max-w-none leading-relaxed text-luxury-slate" dangerouslySetInnerHTML={{
      __html: post.content
    }} />;
  };
  if (loading) {
    return <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse">Loading article...</div>
          </div>
        </div>
        <Footer />
      </div>;
  }
  if (!post) {
    return <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p className="mb-8">The article you're looking for doesn't seem to exist.</p>
            <Button asChild className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black transition-all duration-300 hover:scale-105">
              <Link to="/blog">Return to Blog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>;
  }
  const shareUrls = generateShareUrls();
  return <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="relative h-[50vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent z-10"></div>
          <img src={post?.image_url || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} alt={post?.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 z-20 container pb-12">
            <div className="max-w-4xl">
              <Button variant="outline" asChild className="mb-6 border-white/20 text-white hover:bg-white/10 transition-colors">
                <Link to="/blog" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
              <Badge className="bg-luxury-gold text-luxury-black mb-4 px-4 py-1.5">
                {post?.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">{post?.title}</h1>
              <div className="flex items-center text-sm text-luxury-khaki gap-6">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{post && new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>Josh Rader</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post ? Math.ceil(post.content.length / 1000) : 0} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <article className="luxury-card p-8 mb-8">
                {renderFormattedContent()}
              </article>
              
              <div className="flex items-center justify-between p-6 luxury-card">
                <div className="text-luxury-slate font-medium">Share this article:</div>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-luxury-khaki/30 hover:border-luxury-gold hover:bg-luxury-gold/10 transition-colors" onClick={() => window.open(shareUrls.twitter, '_blank')} title="Share on Twitter">
                    <Twitter size={18} className="text-luxury-slate" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-luxury-khaki/30 hover:border-luxury-gold hover:bg-luxury-gold/10 transition-colors" onClick={() => window.open(shareUrls.facebook, '_blank')} title="Share on Facebook">
                    <Facebook size={18} className="text-luxury-slate" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-luxury-khaki/30 hover:border-luxury-gold hover:bg-luxury-gold/10 transition-colors" onClick={() => window.open(shareUrls.linkedin, '_blank')} title="Share on LinkedIn">
                    <Linkedin size={18} className="text-luxury-slate" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-luxury-khaki/30 hover:border-luxury-gold hover:bg-luxury-gold/10 transition-colors" onClick={handleCopyLink} title="Copy link to clipboard">
                    <Share2 size={18} className="text-luxury-slate" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="luxury-card p-6 mb-8 sticky top-24">
                <h3 className="text-xl font-bold mb-4 text-luxury-black">About the Author</h3>
                <div className="flex items-center gap-4 mb-4">
                  <img alt="Josh Rader" className="w-16 h-16 rounded-full object-cover border-2 border-luxury-gold" src="/lovable-uploads/7381b033-1afc-4319-8933-ee363cefc18a.png" />
                  <div>
                    <h4 className="font-semibold text-luxury-black">Josh Rader</h4>
                    <p className="text-sm text-luxury-gray">Commercial Real Estate Agent</p>
                  </div>
                </div>
                <p className="text-luxury-slate text-sm mb-4">
                  Josh is a licensed commercial real estate agent with over 10 years of experience in Abilene's market.
                </p>
                <Button className="w-full bg-luxury-gold hover:bg-luxury-khaki text-luxury-black transition-all duration-300">
                  Contact Josh
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {relatedPosts.length > 0 && <div className="bg-luxury-cream py-16">
            <div className="container">
              <h3 className="text-2xl font-bold mb-8 text-luxury-black">Continue Reading</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group block luxury-card overflow-hidden hover-lift transition-all duration-300 border-luxury-khaki/20 hover:border-luxury-gold/40">
                    <div className="relative h-48 overflow-hidden">
                      <img src={relatedPost.image_url || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-luxury-gold text-luxury-black font-medium">
                          {relatedPost.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-luxury-gray flex items-center gap-1">
                        <Calendar size={12} className="text-luxury-gold" />
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
                  </Link>)}
              </div>
            </div>
          </div>}
      </main>
      <Footer />
    </div>;
};
export default BlogPost;