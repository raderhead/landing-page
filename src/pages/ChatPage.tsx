
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { toast } from "@/components/ui/use-toast";

const ChatPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has verified the invite code
    const verified = localStorage.getItem("invite_code_verified") === "true";
    setIsVerified(verified);
    
    if (!verified) {
      toast({
        title: "Access Restricted",
        description: "You need to verify your invite code to access this page.",
        variant: "destructive"
      });
      navigate("/auth");
    }
    
    // Check if user is logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to use the chatbot.",
          variant: "destructive"
        });
        navigate("/auth");
      }
    };
    
    checkSession();
  }, [navigate]);

  if (!isVerified) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Real Estate Assistant</h1>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          Ask me anything about real estate, properties, or services offered by Josh Rader Realty.
          I'm here to help with your questions 24/7.
        </p>
        <div className="max-w-3xl mx-auto">
          <ChatBot />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
