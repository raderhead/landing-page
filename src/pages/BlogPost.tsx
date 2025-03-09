
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

// Mock blog post data
const blogPosts = [
  {
    id: "1",
    title: "Commercial Real Estate Trends in Abilene for 2025",
    date: "March 15, 2025",
    author: "Josh Rader",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80",
    content: `
      <p>The commercial real estate market in Abilene continues to show resilience and growth as we move through 2025. Several key trends are shaping the landscape for investors and businesses alike.</p>
      
      <h3>Downtown Revitalization</h3>
      <p>Downtown Abilene has seen a remarkable transformation over the past few years. The ongoing revitalization efforts have attracted new businesses, particularly in the retail and hospitality sectors. Historic buildings are being repurposed into mixed-use developments, combining commercial spaces on ground levels with residential units above.</p>
      
      <h3>Industrial Space Demand</h3>
      <p>With the expansion of e-commerce and manufacturing in the region, industrial properties are experiencing unprecedented demand. Warehousing and distribution centers are particularly sought after, driven by Abilene's strategic location and transportation infrastructure.</p>
      
      <h3>Medical Office Expansion</h3>
      <p>Healthcare facilities continue to expand in and around Abilene. Medical office buildings are seeing increased leasing activity as healthcare providers seek modern, accessible locations to serve the growing population.</p>
      
      <h3>Sustainability Focus</h3>
      <p>Green building practices and energy-efficient properties are becoming a priority for both developers and tenants. Buildings with LEED certification or other sustainability features are commanding premium rates and experiencing lower vacancy rates.</p>
      
      <h3>Technology Integration</h3>
      <p>Smart buildings with advanced technology infrastructure are gaining popularity. Properties with high-speed internet capabilities, integrated security systems, and automated climate controls are particularly attractive to tech-focused businesses and startups.</p>
    `
  },
  {
    id: "2",
    title: "Why Abilene is Becoming a Hub for Small Business Growth",
    date: "February 28, 2025",
    author: "Josh Rader",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&q=80",
    content: "<p>Detailed article about small business growth in Abilene...</p>"
  },
  {
    id: "3",
    title: "Investment Opportunities in Abilene's Commercial Corridors",
    date: "January 20, 2025",
    author: "Josh Rader",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&q=80",
    content: "<p>Analysis of investment opportunities in Abilene's commercial corridors...</p>"
  }
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      const foundPost = blogPosts.find(post => post.id === id);
      setPost(foundPost || null);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);
  
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
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <div className="text-luxury-khaki text-sm mb-2">{post.date} • By {post.author}</div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{post.title}</h1>
              </div>
            </div>
          </div>
          
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
        
        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl font-bold mb-4">Continue Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts
              .filter(p => p.id !== id)
              .map(relatedPost => (
                <Link 
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`} 
                  className="group block luxury-card overflow-hidden hover:shadow-lg"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-luxury-gray">{relatedPost.date}</p>
                    <h3 className="font-semibold mt-1 group-hover:text-luxury-gold transition-colors">{relatedPost.title}</h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
