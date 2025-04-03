
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill in all required fields");
      }

      // Direct API call to the edge function without authentication
      const functionUrl = "https://xfmguaamogzirnnqktwz.supabase.co/functions/v1/send-contact-email";
      
      console.log("Sending request to:", functionUrl);
      
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include apikey directly - this is safe for public functions
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbWd1YWFtb2d6aXJubnFrdHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjMxMzMsImV4cCI6MjA1NzEzOTEzM30.OjoZDtrxo7z2Xa2fQ4_FSKISQehuSNx3UbHKjfFzNxg"
        },
        body: JSON.stringify(formData)
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        throw new Error(errorData?.error || `Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Success response:", data);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. Josh will contact you shortly."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: error instanceof Error ? error.message : "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section bg-luxury-dark py-[50px]">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title text-white">Contact Josh</h2>
          <p className="section-subtitle text-luxury-khaki">
            Ready to find your ideal commercial property? Get in touch with Josh today
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-luxury-black p-8 rounded-md mb-8 border border-luxury-khaki/10">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-luxury-gold p-3 rounded-sm mr-4">
                    <Phone className="h-5 w-5 text-luxury-black" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-luxury-khaki">(325) 665-9244</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-luxury-gold p-3 rounded-sm mr-4">
                    <Mail className="h-5 w-5 text-luxury-black" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-luxury-khaki">Josh@McCullerProperties.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-luxury-gold p-3 rounded-sm mr-4">
                    <MapPin className="h-5 w-5 text-luxury-black" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Office Address</p>
                    <p className="text-luxury-khaki">1500 Industrial Blvd, Suite 300<br />Abilene, TX 79601</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-luxury-gold p-3 rounded-sm mr-4">
                    <Clock className="h-5 w-5 text-luxury-black" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Business Hours</p>
                    <p className="text-luxury-khaki">Monday - Friday: 9:00 AM - 5:00 PM<br />Saturday: By appointment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="bg-luxury-black p-8 rounded-md border border-luxury-khaki/10 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-white">Send a Message</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Your Name</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="bg-luxury-charcoal border-luxury-khaki/20 text-white focus:border-luxury-gold focus:ring-luxury-gold/50" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email Address</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="bg-luxury-charcoal border-luxury-khaki/20 text-white focus:border-luxury-gold focus:ring-luxury-gold/50" />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-white">Phone Number</label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className="bg-luxury-charcoal border-luxury-khaki/20 text-white focus:border-luxury-gold focus:ring-luxury-gold/50" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-white">Your Message</label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="I'm interested in commercial property in downtown Abilene..." rows={4} required className="bg-luxury-charcoal border-luxury-khaki/20 text-white focus:border-luxury-gold focus:ring-luxury-gold/50" />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-luxury-gold hover:bg-luxury-khaki text-luxury-black rounded-sm flex items-center justify-center"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
