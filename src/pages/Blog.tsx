import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Calendar, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category: string;
  created_at: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories for filtering
  const categories = [
    "All", "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter happens client-side in the filteredBlogs variable
  };

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
  };

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchQuery === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stripHtml(blog.excerpt).toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero Banner */}
        <section className="bg-luxury-dark text-white py-24 relative">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 to-transparent z-10"></div>
          <div className="container relative z-20">
            <div className="max-w-2xl">
              <Badge variant="outline" className="border-luxury-gold text-luxury-gold px-4 py-1 text-sm mb-4">
                INSIGHTS & EXPERTISE
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Commercial Real Estate <span className="text-luxury-gold">Insights</span>
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Expert advice, market trends and insights to help you make informed commercial real estate decisions in Abilene.
              </p>
              <form onSubmit={handleSearch} className="flex items-center gap-4 max-w-md">
                <Input 
                  placeholder="Search articles..." 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="section bg-white">
          <div className="container">
            {/* Categories */}
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button 
                  key={category}
                  variant={category === activeCategory ? "default" : "outline"} 
                  className={category === activeCategory ? "bg-luxury-gold hover:bg-luxury-khaki text-luxury-black" : "border-luxury-khaki text-luxury-charcoal hover:bg-luxury-khaki/10"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-luxury-slate">Loading posts...</div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 luxury-card">
                <p className="text-luxury-slate">No blog posts found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="luxury-card overflow-hidden hover-lift group">
                    <div className="h-52 overflow-hidden">
                      <img 
                        src={blog.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="outline" className="border-luxury-khaki text-luxury-khaki mb-3">
                        {blog.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-luxury-gold transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-luxury-gray mb-4 line-clamp-2">
                        {stripHtml(blog.excerpt)}
                      </p>
                      <div className="flex items-center text-sm text-luxury-slate gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{Math.ceil(stripHtml(blog.content).length / 1000)} min read</span>
                        </div>
                      </div>
                      <Link to={`/blog/${blog.id}`} className="text-luxury-gold hover:text-luxury-khaki transition-colors flex items-center gap-1 font-medium">
                        Read more <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Simplified pagination - static for now */}
            {filteredBlogs.length > 0 && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" className="border-luxury-khaki" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" className="border-luxury-gold bg-luxury-gold/10 text-luxury-black" size="sm">
                  1
                </Button>
                <Button variant="outline" className="border-luxury-khaki" size="sm">
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-luxury-dark py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <Book className="h-10 w-10 text-luxury-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-white/80 mb-6">
                Get the latest commercial real estate insights, market trends, and investment opportunities delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Your email address" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
