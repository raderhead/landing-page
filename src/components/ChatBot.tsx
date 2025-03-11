
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Send, Bot, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  initialSystemPrompt?: string;
}

// Simple local fallback responses when the edge function is unavailable
const fallbackResponses = [
  "I can help you find properties that match your needs. What kind of home are you looking for?",
  "Josh Rader Realty specializes in luxury properties throughout the area. Would you like to know more about our available listings?",
  "We offer a range of services including home buying, selling, and property management. How can I assist you today?",
  "The current real estate market in our area is quite active. Properties in good locations are selling quickly.",
  "Our team has extensive experience in negotiating the best deals for our clients. Would you like to schedule a consultation?",
  "I'd be happy to connect you with one of our agents who can provide more detailed information about your specific needs.",
  "Thank you for your interest in Josh Rader Realty. We're committed to finding your dream home!",
];

const getLocalResponse = (userMessage: string) => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

const ChatBot = ({ initialSystemPrompt = "You are a helpful real estate assistant for Josh Rader Realty. You provide information about properties, real estate advice, and answer questions about real estate services. Keep your responses concise, professional, and focused on real estate topics." }: ChatBotProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi there! I'm your Josh Rader Realty assistant. How can I help you with your real estate needs today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalFallback, setUseLocalFallback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      let botResponse: string;

      if (useLocalFallback) {
        // Use local fallback if we've previously had a connection issue
        botResponse = getLocalResponse(message);
      } else {
        // Format chat history for the API
        const formattedHistory = chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Call the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke("gemini-chat", {
          body: {
            message: message,
            chatHistory: [
              { role: "system", content: initialSystemPrompt },
              ...formattedHistory
            ],
          },
        });

        if (error) {
          console.error("Supabase function error:", error);
          // Set flag to use local fallback for future messages
          setUseLocalFallback(true);
          // Get a local fallback response
          botResponse = getLocalResponse(message);
          // Show a toast but don't throw, as we'll continue with the fallback
          toast({
            title: "Connection issue",
            description: "Using offline mode for responses. You can continue chatting.",
            variant: "destructive",
          });
        } else {
          botResponse = data.response;
        }
      }

      // Add bot response to chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: botResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Set flag to use local fallback for future messages
      setUseLocalFallback(true);
      
      // Show a user-friendly error message
      toast({
        title: "Error",
        description: "We're having trouble connecting to our assistant right now. Switching to offline mode.",
        variant: "destructive",
      });
      
      // Add a fallback response
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting to my knowledge base. I'll use my offline mode to help you. What kind of real estate information are you looking for?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg bg-card text-card-foreground">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-luxury-gold" />
          <h3 className="font-semibold text-lg">Josh Rader Realty Assistant</h3>
        </div>
        {useLocalFallback && (
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Offline Mode</span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-luxury-navy text-white"
                  : "bg-luxury-khaki/20 text-luxury-dark"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-luxury-gold" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <p className="text-xs font-semibold">
                  {msg.role === "user" ? "You" : "Josh Rader Assistant"}
                </p>
              </div>
              <div className="whitespace-pre-wrap text-sm">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-luxury-khaki/20 text-luxury-dark">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-4 w-4 text-luxury-gold" />
                <p className="text-xs font-semibold">Josh Rader Assistant</p>
              </div>
              <div className="whitespace-pre-wrap text-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !message.trim()}
            className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
