
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import ChatBot from "./ChatBot";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  
  const handleChatClick = () => {
    setIsOpen(!isOpen);
  };

  // Close chat when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target as Node) && 
          event.target instanceof Element && !event.target.closest('button[aria-label="Chat with Real Estate Assistant"]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleChatClick}
          className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-all duration-300"
          aria-label="Chat with Real Estate Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>

        {isOpen && (
          <div 
            ref={chatboxRef}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-lg border shadow-lg overflow-hidden animate-slide-up"
            style={{
              transformOrigin: 'bottom right',
              animation: 'slideUp 0.3s ease-out forwards'
            }}
          >
            <div className="relative h-full">
              <Button 
                className="absolute right-2 top-2 z-10 rounded-full h-8 w-8 p-0 bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="h-full">
                <ChatBot />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default ChatButton;
