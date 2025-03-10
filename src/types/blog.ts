
export type BlogContentBlock = {
  id: string;
  type: 'paragraph' | 'heading' | 'quote' | 'list' | 'image';
  content: string;
  style?: {
    fontSize?: string;
    color?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
  };
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  formattedContent?: BlogContentBlock[] | null;
  image_url?: string;
  category: string;
  created_at: string;
};

export const BLOG_CATEGORIES = [
  "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
];

export const TEXT_COLORS = [
  { name: "Black", value: "#121212" },
  { name: "Dark Gray", value: "#404040" },
  { name: "Gray", value: "#707070" },
  { name: "Gold", value: "#D4B87B" },
  { name: "Navy", value: "#1A2A3A" },
  { name: "White", value: "#FFFFFF" },
];

export const FONT_SIZES = [
  { name: "Small", value: "text-sm" },
  { name: "Normal", value: "text-base" },
  { name: "Large", value: "text-lg" },
  { name: "XL", value: "text-xl" },
  { name: "2XL", value: "text-2xl" },
  { name: "3XL", value: "text-3xl" },
];

export const TEXT_ALIGNMENTS = [
  { name: "Left", value: "text-left" },
  { name: "Center", value: "text-center" },
  { name: "Right", value: "text-right" },
  { name: "Justify", value: "text-justify" },
];

// Adding utility functions for blog management
export const formatBlogDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const estimateReadingTime = (content: string): number => {
  // Average reading speed: 200 words per minute
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};
