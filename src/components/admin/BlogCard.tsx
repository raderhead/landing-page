
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pen, Trash2, Eye, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
  author_id: string;
};

interface BlogCardProps {
  blog: BlogPost;
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
}

const BlogCard = ({ blog, onEdit, onDelete }: BlogCardProps) => {
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);
  const [isOwner, setIsOwner] = React.useState(false);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUser(data.session.user.id);
        setIsOwner(data.session.user.id === blog.author_id);
      }
    };
    
    checkUser();
  }, [blog.author_id]);

  return (
    <div className={`luxury-card p-6 flex flex-col md:flex-row gap-6 hover:border-luxury-gold/40 transition-all duration-300 ${!isOwner ? 'border-red-300 bg-red-50' : ''}`}>
      {blog.image_url && (
        <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="bg-luxury-gold text-luxury-black mb-2 font-medium">
              {blog.category}
            </Badge>
            <h3 className="text-xl font-bold mb-2 text-luxury-black hover:text-luxury-gold transition-colors">{blog.title}</h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(blog)}
              className={`${isOwner ? 'text-luxury-slate hover:text-luxury-gold hover:border-luxury-gold' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
              disabled={!isOwner}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-luxury-slate hover:text-luxury-gold hover:border-luxury-gold transition-colors"
            >
              <Link to={`/blog/${blog.id}`} target="_blank">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(blog.id)}
              className={`${isOwner ? 'text-luxury-slate hover:text-destructive hover:border-destructive' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
              disabled={!isOwner}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-luxury-gray mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.excerpt }}></p>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-luxury-slate">
            {new Date(blog.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          
          {!isOwner && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>You are not the author of this post</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
