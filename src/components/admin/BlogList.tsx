
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Pen, 
  Eye, 
  Trash2, 
  Calendar, 
  CheckSquare, 
  Square, 
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

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
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedBlogs(prev => 
      prev.includes(id) 
        ? prev.filter(blogId => blogId !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map(blog => blog.id));
    }
  };

  const handleMultipleDelete = () => {
    if (selectedBlogs.length === 0) {
      toast({
        title: "No blogs selected",
        description: "Please select at least one blog to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedBlogs.length} blog post${selectedBlogs.length > 1 ? 's' : ''}?`)) {
      setIsDeleting(true);
      
      // Create a promise for each deletion
      const deletePromises = selectedBlogs.map(id => 
        new Promise<void>((resolve) => {
          onDelete(id);
          resolve();
        })
      );
      
      // Execute all deletions and reset selection when done
      Promise.all(deletePromises)
        .then(() => {
          toast({
            title: "Success",
            description: `${selectedBlogs.length} blog post${selectedBlogs.length > 1 ? 's' : ''} deleted successfully`,
          });
          setSelectedBlogs([]);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-luxury-gold/20">
        <h2 className="text-2xl font-bold text-luxury-black">Your Blog Posts</h2>
        
        {blogs.length > 0 && (
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSelectAll}
              className="border-luxury-gold/30 text-luxury-slate hover:bg-luxury-khaki/10 hover:text-luxury-black"
            >
              {selectedBlogs.length === blogs.length ? (
                <CheckSquare className="h-4 w-4 text-luxury-gold mr-1" />
              ) : (
                <Square className="h-4 w-4 mr-1" />
              )}
              {selectedBlogs.length === blogs.length ? "Deselect All" : "Select All"}
            </Button>
            
            {selectedBlogs.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMultipleDelete}
                disabled={isDeleting}
                className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected ({selectedBlogs.length})
              </Button>
            )}
          </div>
        )}
      </div>
      
      {blogs.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-white to-luxury-cream rounded-lg shadow-sm border border-luxury-gold/10">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-luxury-cream">
            <AlertTriangle className="h-8 w-8 text-luxury-gold/70" />
          </div>
          <p className="text-luxury-slate font-medium text-lg">You haven't created any blog posts yet.</p>
          <p className="text-luxury-gray mt-2">Click the "New Blog Post" button to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map(blog => (
            <div 
              key={blog.id} 
              className={`relative luxury-card bg-gradient-to-b from-white to-luxury-cream hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-lg ${
                selectedBlogs.includes(blog.id) ? 'ring-2 ring-luxury-gold/70' : ''
              }`}
            >
              <div className="absolute top-4 left-4 z-10">
                <button
                  className="w-5 h-5 flex items-center justify-center rounded transition-all duration-200"
                  onClick={() => toggleSelect(blog.id)}
                >
                  {selectedBlogs.includes(blog.id) ? (
                    <CheckSquare className="h-5 w-5 text-luxury-gold" />
                  ) : (
                    <Square className="h-5 w-5 text-luxury-gray hover:text-luxury-gold" />
                  )}
                </button>
              </div>

              <div className="flex flex-col md:flex-row">
                {blog.image_url && (
                  <div className="w-full md:w-64 h-52 flex-shrink-0 overflow-hidden border-r border-luxury-gold/10 relative">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                
                <div className="flex-1 p-6 pl-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge className="bg-luxury-gold/90 text-luxury-black mb-3 font-medium">
                        {blog.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 text-luxury-black group-hover:text-luxury-gold transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-luxury-gray mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.excerpt }}></p>
                      <div className="flex items-center text-sm text-luxury-slate gap-1">
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
