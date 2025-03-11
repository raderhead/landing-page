
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

// Commercial real estate specific fallback responses when the edge function is unavailable
const fallbackResponses = [
  "I specialize in commercial real estate in Abilene, TX. How can I assist you with your commercial property needs?",
  "Josh Rader Realty offers expert commercial real estate services in Abilene. Would you like information about available commercial properties?",
  "The commercial market in Abilene has several key areas and growing industries including Healthcare, Educational Facilities, and Manufacturing spaces. Are you interested in a specific area?",
  "We offer services for retail leasing, office leasing, industrial properties, and investment analysis. Would you like to schedule a consultation with Josh Rader?",
  "For detailed information about specific commercial listings or personalized advice, I'd recommend scheduling a meeting with Josh Rader directly.",
  "Commercial real estate in Abilene includes retail spaces, office buildings, industrial properties, and mixed-use developments. What type of property are you looking for?",
  "I'm here to answer questions about commercial real estate in Abilene or help you schedule a meeting with Josh Rader. How can I assist you today?",
];

const getLocalResponse = (userMessage: string) => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

const ChatBot = ({ initialSystemPrompt = "You are a specialized real estate assistant for Josh Rader Realty, focused EXCLUSIVELY on commercial real estate in Abilene, Texas. Only provide information about commercial real estate in Abilene or help schedule meetings with Josh Rader." }: ChatBotProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi there! I'm your commercial real estate assistant for Josh Rader Realty. I can provide information about commercial properties in Abilene, TX or help you schedule a meeting with Josh Rader. How can I assist you today?",
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
          content: "I'm sorry, I'm having trouble connecting to my knowledge base. I'll use my offline mode to help you. What kind of commercial real estate information for Abilene, TX are you looking for?",
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
          <h3 className="font-semibold text-lg">Josh Rader Commercial Real Estate</h3>
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
                  {msg.role === "user" ? "You" : "Commercial Real Estate Assistant"}
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
                <p className="text-xs font-semibold">Commercial Real Estate Assistant</p>
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
            placeholder="Ask about commercial real estate in Abilene..."
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
