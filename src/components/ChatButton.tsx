
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import ChatBot from "./ChatBot";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleChatClick = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
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
      <div className="fixed bottom-0 right-6 z-50">
        {!isOpen && (
          <Button
            ref={buttonRef}
            onClick={handleChatClick}
            className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-all duration-300 mb-4"
            aria-label="Chat with Real Estate Assistant"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}

        {isOpen && (
          <div 
            ref={chatboxRef}
            className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-lg border shadow-lg overflow-hidden"
            style={{
              transformOrigin: 'bottom right',
              animation: 'chatExpand 0.4s ease-out forwards'
            }}
          >
            <div className="relative h-full">
              <Button 
                className="absolute right-2 top-2 z-10 rounded-full h-8 w-8 p-0 bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
                onClick={handleCloseChat}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="h-full overflow-hidden">
                <ChatBot />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes chatExpand {
          0% {
            opacity: 0;
            height: 64px;
            width: 64px;
            border-radius: 9999px;
            transform: translateY(0);
          }
          30% {
            opacity: 0.5;
            height: 64px;
            width: 64px;
            border-radius: 9999px;
          }
          100% {
            opacity: 1;
            height: 500px;
            width: 350px;
            border-radius: 8px;
            transform: translateY(-4px);
          }
        }
        
        @media (min-width: 640px) {
          @keyframes chatExpand {
            0% {
              opacity: 0;
              height: 64px;
              width: 64px;
              border-radius: 9999px;
              transform: translateY(0);
            }
            30% {
              opacity: 0.5;
              height: 64px;
              width: 64px;
              border-radius: 9999px;
            }
            100% {
              opacity: 1;
              height: 500px;
              width: 400px;
              border-radius: 8px;
              transform: translateY(-4px);
            }
          }
        }
      `}</style>
    </>
  );
};

export default ChatButton;
