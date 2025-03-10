
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const ChatPage = () => {
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
