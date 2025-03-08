
import { Building, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-realestate-navy text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-6 w-6" />
              <span className="font-bold text-xl">Josh Rader</span>
            </div>
            <p className="text-white/80 mb-6">
              Licensed commercial real estate agent serving Abilene, TX and surrounding areas with expertise in all types of commercial properties.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/80 hover:text-realestate-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-realestate-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-realestate-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-realestate-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-white/80 hover:text-realestate-accent transition-colors">Services</a></li>
              <li><a href="#properties" className="text-white/80 hover:text-realestate-accent transition-colors">Properties</a></li>
              <li><a href="#about" className="text-white/80 hover:text-realestate-accent transition-colors">About Josh</a></li>
              <li><a href="#contact" className="text-white/80 hover:text-realestate-accent transition-colors">Contact</a></li>
              <li><a href="#" className="text-white/80 hover:text-realestate-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-white/80 hover:text-realestate-accent transition-colors">Retail Leasing</a></li>
              <li><a href="#services" className="text-white/80 hover:text-realestate-accent transition-colors">Office Leasing</a></li>
              <li><a href="#services" className="text-white/80 hover:text-realestate-accent transition-colors">Industrial Properties</a></li>
              <li><a href="#services" className="text-white/80 hover:text-realestate-accent transition-colors">Property Investment</a></li>
              <li><a href="#services" className="text-white/80 hover:text-realestate-accent transition-colors">Market Analysis</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Info</h4>
            <address className="not-italic text-white/80 space-y-2">
              <p>123 Commercial Ave, Suite 200</p>
              <p>Abilene, TX 79601</p>
              <p>Phone: (325) 555-1234</p>
              <p>Email: josh.rader@example.com</p>
            </address>
          </div>
        </div>
        
        <hr className="border-white/20 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Josh Rader Commercial Real Estate. All rights reserved.
          </p>
          <p className="text-white/80 text-sm">
            Licensed Texas Real Estate Agent | TREC License #12345678
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
