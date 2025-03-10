
import React from 'react';
import BlogCard from './BlogCard';
import { BlogPost } from '@/types/blog';

interface BlogListProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
}

const BlogList = ({ blogs, onEdit, onDelete }: BlogListProps) => {
  // Filter out only the specific problematic blog post by title
  const filteredBlogs = blogs.filter(blog => 
    blog.title !== "Abilene Market Is on the rise after Trump's announcement of AI jobs"
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Your Blog Posts</h2>
      
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12 luxury-card">
          <p className="text-luxury-slate">You haven't created any blog posts yet.</p>
        </div>
      ) : (
        filteredBlogs.map(blog => (
          <BlogCard 
            key={blog.id} 
            blog={blog} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))
      )}
    </div>
  );
};

export default BlogList;
