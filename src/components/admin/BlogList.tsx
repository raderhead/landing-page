
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
  AlertCircle,
  Check,
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
        title: "No posts selected",
        description: "Please select at least one post to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Delete ${selectedBlogs.length} selected post${selectedBlogs.length > 1 ? 's' : ''}?`)) {
      setIsDeleting(true);
      
      const deletePromises = selectedBlogs.map(id => 
        new Promise<void>((resolve) => {
          onDelete(id);
          resolve();
        })
      );
      
      Promise.all(deletePromises)
        .then(() => {
          toast({
            title: `${selectedBlogs.length} post${selectedBlogs.length > 1 ? 's' : ''} deleted`,
            description: "Successfully removed the selected content",
          });
          setSelectedBlogs([]);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    }
  };

  return (
    <div className="space-y-4">
      {blogs.length > 0 && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-lg font-medium">Your posts</h2>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleSelectAll}
              className="text-xs h-8"
            >
              {selectedBlogs.length === blogs.length ? (
                <CheckSquare className="h-4 w-4 mr-1.5 text-primary" />
              ) : (
                <Square className="h-4 w-4 mr-1.5" />
              )}
              {selectedBlogs.length === blogs.length ? "Deselect all" : "Select all"}
            </Button>
            
            {selectedBlogs.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleMultipleDelete}
                disabled={isDeleting}
                className="text-xs h-8"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete ({selectedBlogs.length})
              </Button>
            )}
          </div>
        </div>
      )}
      
      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-muted">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground/70" />
          <p className="text-foreground font-medium">No blog posts yet</p>
          <p className="text-muted-foreground text-sm mt-1">Click "New Post" to create content</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {blogs.map(blog => (
            <div 
              key={blog.id} 
              className={`relative bg-white border rounded-lg overflow-hidden transition-all ${
                selectedBlogs.includes(blog.id) ? 'ring-1 ring-primary' : ''
              }`}
            >
              <div className="absolute top-3 left-3 z-10">
                <button
                  className="h-5 w-5 flex items-center justify-center"
                  onClick={() => toggleSelect(blog.id)}
                  aria-label={selectedBlogs.includes(blog.id) ? "Deselect post" : "Select post"}
                >
                  {selectedBlogs.includes(blog.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground/60 hover:text-primary transition-colors" />
                  )}
                </button>
              </div>

              <div className="flex flex-col md:flex-row">
                {blog.image_url && (
                  <div className="w-full md:w-48 h-40 flex-shrink-0 bg-muted/30">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-4 pt-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2 font-normal text-xs">
                        {blog.category}
                      </Badge>
                      <h3 className="text-base font-medium mb-1 line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.excerpt }}></p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>
                          {new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-3 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(blog)}
                        className="h-8 px-2"
                      >
                        <Pen className="h-3.5 w-3.5" />
                        <span className="sr-only md:not-sr-only md:ml-1.5 text-xs">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 px-2"
                      >
                        <Link to={`/blog/${blog.id}`} target="_blank">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only md:not-sr-only md:ml-1.5 text-xs">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(blog.id)}
                        className="h-8 px-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only md:not-sr-only md:ml-1.5 text-xs">Delete</span>
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
