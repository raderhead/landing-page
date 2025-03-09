
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Book, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const BlogsSection = () => {
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
    }
  ];

  return (
    <section id="blogs" className="section bg-white">
      <div className="container">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="border-luxury-gold text-luxury-gold px-4 py-1 text-sm mb-4">
            INSIGHTS
          </Badge>
          <h2 className="section-title mb-4">Latest from the Blog</h2>
          <p className="text-luxury-gray max-w-2xl mx-auto">
            Stay informed with the latest insights, trends, and opportunities in Abilene's commercial real estate market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm"
            asChild
          >
            <Link to="/blog">
              <Book className="mr-2 h-5 w-5" />
              View All Articles
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
