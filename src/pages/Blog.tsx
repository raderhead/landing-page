
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Calendar, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  // Sample blog data - in a real app, this would come from an API or CMS
  const blogs = [
    {
      id: 1,
      title: "Commercial Real Estate Trends in Abilene for 2023",
      excerpt: "Discover the latest market trends and opportunities in Abilene's commercial real estate landscape.",
      date: "April 15, 2023",
      readTime: "5 min read",
      category: "Market Trends",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "5 Things to Consider When Leasing Commercial Space",
      excerpt: "Important factors that business owners should evaluate before signing a commercial lease agreement.",
      date: "March 8, 2023",
      readTime: "7 min read",
      category: "Leasing",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Investment Opportunities in Abilene's Growing Districts",
      excerpt: "A comprehensive guide to the most promising commercial investment areas in and around Abilene.",
      date: "February 22, 2023",
      readTime: "6 min read",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      title: "How to Navigate Commercial Property Inspections",
      excerpt: "A step-by-step guide to ensure thorough commercial property inspections before making investment decisions.",
      date: "January 30, 2023",
      readTime: "8 min read",
      category: "Due Diligence",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Understanding Commercial Property Valuation Methods",
      excerpt: "Learn about different valuation approaches and how they impact commercial real estate investments.",
      date: "December 15, 2022",
      readTime: "10 min read",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
    }
  ];

  // Categories for filtering
  const categories = [
    "All", "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
  ];

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
              <div className="flex items-center gap-4 max-w-md">
                <Input 
                  placeholder="Search articles..." 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60" 
                />
                <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
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
                  variant={category === "All" ? "default" : "outline"} 
                  className={category === "All" ? "bg-luxury-gold hover:bg-luxury-khaki text-luxury-black" : "border-luxury-khaki text-luxury-charcoal hover:bg-luxury-khaki/10"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <div key={blog.id} className="luxury-card overflow-hidden hover-lift group">
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={blog.image} 
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
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-luxury-slate gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                    <Link to={`/blog/${blog.id}`} className="text-luxury-gold hover:text-luxury-khaki transition-colors flex items-center gap-1 font-medium">
                      Read more <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - simplified version */}
            <div className="flex justify-center gap-2">
              <Button variant="outline" className="border-luxury-khaki" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" className="border-luxury-gold bg-luxury-gold/10 text-luxury-black" size="sm">
                1
              </Button>
              <Button variant="outline" className="border-luxury-khaki" size="sm">
                2
              </Button>
              <Button variant="outline" className="border-luxury-khaki" size="sm">
                Next
              </Button>
            </div>
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
