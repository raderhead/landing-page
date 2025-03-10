
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const ChatButton = () => {
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleChatClick}
        className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-all duration-300"
        aria-label="Chat with Real Estate Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ChatButton;
