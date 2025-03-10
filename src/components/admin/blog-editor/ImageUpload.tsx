
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  imageUrl: string | undefined;
  onImageChange: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onImageChange }) => {
  const [uploading, setUploading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(e.target.value);
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
        
      onImageChange(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <label htmlFor="image" className="block text-sm font-medium mb-1">Featured Image</label>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <div className="relative">
            <Input
              id="image_url"
              name="image_url"
              placeholder="Enter image URL or upload"
              value={imageUrl || ''}
              onChange={handleInputChange}
              className="pl-10"
            />
            <Image className="absolute left-3 top-2.5 h-5 w-5 text-luxury-khaki" />
          </div>
          <div className="mt-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 text-luxury-gold hover:text-luxury-khaki transition-colors">
                <Image className="h-4 w-4" />
                <span>Upload new image</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            {uploading && <p className="text-xs mt-1">Uploading...</p>}
          </div>
        </div>
        
        {imageUrl && (
          <div className="w-32 h-32 border rounded overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt="Blog preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
