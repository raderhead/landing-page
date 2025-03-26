
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebhookTester from "@/components/WebhookTester";

const Webhooks = () => {
  return (
    <>
      <Helmet>
        <title>Webhook Testing | Abilene Commercial</title>
        <meta name="description" content="Test and manage webhooks for Abilene Commercial" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16 bg-luxury-black text-white">
          <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8 font-serif text-luxury-gold">Webhook Manager</h1>
            <WebhookTester />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Webhooks;
