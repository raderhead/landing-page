import React, { useState, useEffect } from 'react';
import { supabase, getFilteredBlogs } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Calendar, Clock, Search, Filter } from "lucide-react";
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
      // Use the getFilteredBlogs helper function
      const filteredData = await getFilteredBlogs();
      
      // Apply additional filtering here as a safety measure
      const safeBlogs = filteredData.filter(blog => 
        !blog.title.includes("Abilene") && 
        !blog.excerpt.includes("Trump") && 
        !blog.excerpt.includes("Abilene Market")
      );
      
      setBlogs(safeBlogs);
      console.log("Filtered blogs page:", safeBlogs);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter happens client-side in the filteredBlogs variable
  };

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
  };

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter(blog => {
    // Extra safety check
    if (blog.title.includes("Abilene") || 
        blog.excerpt.includes("Trump") || 
        blog.excerpt.includes("Abilene Market")) {
      return false;
    }
    
    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.excerpt;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    const matchesSearch = searchQuery === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      textContent.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero Banner */}
        <section className="relative bg-luxury-dark text-white py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/95 to-luxury-charcoal/90 z-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80" 
              alt="Commercial Real Estate Blog" 
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="container relative z-20">
            <div className="max-w-2xl">
              <Badge variant="outline" className="border-luxury-gold text-luxury-gold px-4 py-1 text-sm mb-4">
                INSIGHTS & EXPERTISE
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Commercial Real Estate <span className="text-luxury-gold">Insights</span>
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Expert advice, market trends and insights to help you make informed commercial real estate decisions.
              </p>
              <form onSubmit={handleSearch} className="flex items-center gap-4 max-w-md">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Search articles..." 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                </div>
                <Button 
                  type="submit" 
                  className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black transition-all duration-300 hover:scale-105"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="section bg-white">
          <div className="container">
            {/* Categories */}
            <div className="mb-12 border-b border-luxury-khaki/10 pb-6">
              <div className="flex items-center justify-center mb-4">
                <Filter className="mr-2 h-4 w-4 text-luxury-gold" />
                <h3 className="text-sm font-medium text-luxury-slate">FILTER BY CATEGORY</h3>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant={category === activeCategory ? "default" : "outline"} 
                    className={category === activeCategory ? 
                      "bg-luxury-gold hover:bg-luxury-khaki text-luxury-black transition-all duration-300" : 
                      "border-luxury-khaki/30 text-luxury-charcoal hover:bg-luxury-khaki/10 hover:border-luxury-gold/40 transition-all duration-300"}
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
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
                {filteredBlogs.map((blog) => {
                  // Additional check at render time
                  if (blog.title.includes("Abilene") || 
                      blog.excerpt.includes("Trump") || 
                      blog.excerpt.includes("Abilene Market")) {
                    return null;
                  }
                  
                  return (
                    <div key={blog.id} className="luxury-card overflow-hidden group hover-lift transition-all duration-300 border-luxury-khaki/20 hover:border-luxury-gold/40">
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={blog.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black font-medium">
                            {blog.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-luxury-gold transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center text-sm text-luxury-slate gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-luxury-gold" />
                            <span>{new Date(blog.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-luxury-gold" />
                            <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                          </div>
                        </div>
                        <div className="text-luxury-gray mb-4 line-clamp-2 min-h-[48px]" 
                             dangerouslySetInnerHTML={{ __html: blog.excerpt }}>
                        </div>
                        <Link 
                          to={`/blog/${blog.id}`} 
                          className="text-luxury-gold hover:text-luxury-khaki transition-colors flex items-center gap-1 font-medium group-hover:font-semibold hover-underline-grow"
                        >
                          Read more <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Simplified pagination - static for now */}
            {filteredBlogs.length > 0 && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" className="border-luxury-khaki/30 hover:border-luxury-gold/40 transition-all duration-300" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" className="border-luxury-gold bg-luxury-gold/10 text-luxury-black" size="sm">
                  1
                </Button>
                <Button variant="outline" className="border-luxury-khaki/30 hover:border-luxury-gold/40 transition-all duration-300" size="sm">
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-luxury-dark py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/95 to-luxury-charcoal/90 z-0"></div>
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&q=80" 
              alt="Newsletter Background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <Book className="h-10 w-10 text-luxury-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-white/80 mb-6">
                Get the latest commercial real estate insights, market trends, and investment opportunities delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Your email address" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black transition-all duration-300 hover:scale-105">
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
