
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData);
    
    // Simulate network request
    setTimeout(() => {
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
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="section bg-luxury-black py-[50px] px-4 md:px-0">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-white">Send a Message</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-xl font-medium text-white">Your Name</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="bg-luxury-charcoal border-luxury-charcoal text-white h-14 text-lg placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 text-xl font-medium text-white">Email Address</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="bg-luxury-charcoal border-luxury-charcoal text-white h-14 text-lg placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-2 text-xl font-medium text-white">Phone Number</label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="bg-luxury-charcoal border-luxury-charcoal text-white h-14 text-lg placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-2 text-xl font-medium text-white">Your Message</label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="I'm interested in commercial property in downtown Abilene..."
              rows={6}
              required
              className="bg-luxury-charcoal border-luxury-charcoal text-white text-lg resize-none min-h-[160px] placeholder:text-gray-400"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black rounded-sm h-14 text-lg font-medium"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
