
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import AllProperties from "./pages/AllProperties";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ScrollToTop component to handle hash navigation
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If no hash, scroll to top
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    
    // If hash exists, scroll to element with offset
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth"
        });
      }
    }, 100);
  }, [pathname, hash]);

  return null;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<AllProperties />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
