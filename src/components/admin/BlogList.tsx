
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pen, Eye, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
};

interface BlogListProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
}

const BlogList = ({ blogs, onEdit, onDelete }: BlogListProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-luxury-black border-b border-luxury-gold/20 pb-4">Your Blog Posts</h2>
      
      {blogs.length === 0 ? (
        <div className="text-center py-16 luxury-card bg-white/50 backdrop-blur-sm border border-luxury-gold/10">
          <p className="text-luxury-slate font-medium">You haven't created any blog posts yet.</p>
          <p className="text-luxury-gray mt-2">Click the "New Blog Post" button to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map(blog => (
            <div key={blog.id} className="luxury-card bg-white hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                {blog.image_url && (
                  <div className="w-full md:w-60 h-40 flex-shrink-0 overflow-hidden border-r border-luxury-gold/10">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge className="bg-luxury-gold text-luxury-black mb-3 font-medium">
                        {blog.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 text-luxury-black group-hover:text-luxury-gold transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-luxury-gray mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.excerpt }}></p>
                      <div className="flex items-center text-sm text-luxury-slate gap-1 mb-4">
                        <Calendar className="h-4 w-4 text-luxury-gold mr-1" />
                        <span>
                          {new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(blog)}
                        className="border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-white transition-colors"
                      >
                        <Pen className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-luxury-gold/30 text-luxury-gray hover:bg-luxury-khaki/10 hover:text-luxury-black transition-colors"
                      >
                        <Link to={`/blog/${blog.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(blog.id)}
                        className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
