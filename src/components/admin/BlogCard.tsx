
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pen, Trash2 } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
};

interface BlogCardProps {
  blog: BlogPost;
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
}

const BlogCard = ({ blog, onEdit, onDelete }: BlogCardProps) => {
  return (
    <div className="luxury-card p-6 flex flex-col md:flex-row gap-6">
      {blog.image_url && (
        <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="border-luxury-khaki text-luxury-khaki mb-2">
              {blog.category}
            </Badge>
            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(blog)}
              className="text-luxury-slate hover:text-luxury-black"
            >
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(blog.id)}
              className="text-luxury-slate hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-luxury-gray mb-3 line-clamp-2">{blog.excerpt}</p>
        <p className="text-sm text-luxury-slate">
          {new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
