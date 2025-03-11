
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
        throw new Error(error.message);
      }

      // Add bot response to chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Show a more user-friendly error message
      toast({
        title: "Error",
        description: "We're having trouble connecting to our assistant right now. Please try again later.",
        variant: "destructive",
      });
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
