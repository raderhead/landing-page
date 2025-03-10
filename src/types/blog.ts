
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
};

export const BLOG_CATEGORIES = [
  "Market Trends", "Leasing", "Investment", "Due Diligence", "Property Management"
];
