
import { Quote } from "lucide-react";

const testimonials = [{
  quote: "Josh helped us find the perfect retail location for our business. His knowledge of the Abilene market was invaluable and saved us countless hours.",
  name: "Sarah Johnson",
  title: "Owner, Abilene Boutique",
  image: "https://randomuser.me/api/portraits/women/32.jpg"
}, {
  quote: "As an investor new to commercial real estate, Josh provided expert guidance that helped me build a profitable portfolio of properties in Abilene.",
  name: "Michael Rodriguez",
  title: "Real Estate Investor",
  image: "https://randomuser.me/api/portraits/men/46.jpg"
}, {
  quote: "When we needed to expand our office space, Josh understood our requirements perfectly and found us a property that exceeded our expectations.",
  name: "Lisa Thompson",
  title: "CEO, Thompson Consulting",
  image: "https://randomuser.me/api/portraits/women/65.jpg"
}];

const TestimonialsSection = () => {
  return <section className="section bg-luxury-charcoal py-[50px]">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title text-white font-sans">Client <span className="font-serif text-luxury-gold">Testimonials</span></h2>
          <p className="section-subtitle text-luxury-khaki font-sans">
            Hear from businesses and investors who have worked with Josh to find their ideal commercial properties
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-luxury-dark p-8 rounded-md shadow-md relative border border-luxury-khaki/10">
              <Quote className="h-12 w-12 text-luxury-gold/20 absolute top-6 right-6" />
              <p className="text-luxury-khaki mb-8 relative z-10 leading-relaxed font-sans">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border border-luxury-gold/30" />
                <div>
                  <p className="font-bold text-white font-sans">{testimonial.name}</p>
                  <p className="text-sm text-luxury-khaki/70 font-sans">{testimonial.title}</p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};

export default TestimonialsSection;
