
import { Quote } from "lucide-react";

const testimonials = [{
  quote: "Working with Josh made transaction a breeze. The entire process was smooth, efficient, and handled with excellence from start to finish.",
  name: "Tim Smith",
  title: "Owner, Abilene Boutique",
  image: "/lovable-uploads/44b186ce-f8a4-4d10-b914-71efca66716a.png"
}, {
  quote: "As an investor and builder to commercial real estate, Josh has helped me find tenants for my properties!",
  name: "Landon Couch",
  title: "Real Estate Investor",
  image: "/lovable-uploads/331f0b08-b598-4594-80fd-793c91cafd82.png"
}, {
  quote: "With Josh's guidance, we were able to successfully transition our business and property, securing the equity we had built over the years. His expertise and integrity made the entire process feel seamless and rewarding.",
  name: "J & Lorraine Wilson",
  title: "Property Owners",
  image: "/lovable-uploads/5d165228-18d1-4470-8883-c28d37702b66.png"
}];

const TestimonialsSection = () => {
  return <section className="section bg-luxury-charcoal py-[50px]">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-white font-sans text-4xl font-bold mb-6">Client <span className="font-serif text-luxury-gold">Testimonials</span></h2>
          <p className="text-white font-sans text-xl md:text-2xl font-medium mb-8">
            Hear from businesses and investors who have worked with Josh to find their ideal commercial properties
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-luxury-dark p-8 rounded-md shadow-md relative border border-white/10">
              <Quote className="h-12 w-12 text-luxury-gold/20 absolute top-6 right-6" />
              <p className="text-white mb-8 relative z-10 leading-relaxed font-sans">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border border-luxury-gold/30" />
                <div>
                  <p className="font-bold text-white font-sans">{testimonial.name}</p>
                  <p className="text-sm text-white/70 font-sans">{testimonial.title}</p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};

export default TestimonialsSection;
