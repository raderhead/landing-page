
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ChatBot from "./ChatBot";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleChatClick = () => {
    setIsOpen(true);
  };

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
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 h-[600px] sm:h-[700px] max-h-[90vh]">
          <Button 
            className="absolute right-2 top-2 z-10 rounded-full h-8 w-8 p-0 bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <ChatBot />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;
