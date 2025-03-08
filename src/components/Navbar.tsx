import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Building, Menu, X, Phone } from "lucide-react";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-luxury-black shadow-md py-2' : 'bg-transparent py-4'}`}>
      <nav className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 text-white group">
            <Building className="h-8 w-8 text-luxury-gold group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl group-hover:text-luxury-gold transition-colors">Josh Rader</span>
          </a>
          
          <a href="https://mccullarproperties.com/" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 border-l border-luxury-gold/30 pl-4 group hover:bg-luxury-charcoal/30 transition-all p-1 rounded">
            <span className="text-luxury-khaki text-xs uppercase tracking-wide group-hover:text-luxury-gold transition-colors">PROUDLY
BROKERED BY</span>
            <img alt="McCullar Properties Group" className="h-8 w-auto group-hover:scale-105 transition-transform" src="/lovable-uploads/bda42a85-fa69-47e4-b7d2-1900e3411ffb.png" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow">Services</a>
          <a href="#properties" className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow">Properties</a>
          <a href="#about" className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow">About</a>
          <a href="#contact" className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow">Contact</a>
          <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black flex items-center gap-2 rounded-sm hover-scale group">
            <Phone className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span>Call Josh</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white hover:text-luxury-gold transition-colors hover-scale" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && <div className="md:hidden bg-luxury-dark py-4 border-t border-luxury-khaki/20 animate-fade-in">
          <div className="container flex flex-col gap-4">
            <a href="https://mccullarproperties.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 border-b border-luxury-khaki/10 group hover:bg-luxury-charcoal/30 transition-all p-2 rounded">
              <span className="text-luxury-khaki text-xs uppercase tracking-wide group-hover:text-luxury-gold transition-colors">Proudly Brokered By</span>
              <img alt="McCullar Properties Group" className="h-6 w-auto group-hover:scale-105 transition-transform" src="/lovable-uploads/6635c4f1-9b1d-4ef5-949a-4b78d5df568e.png" />
            </a>
            <a href="#services" className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#properties" className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all" onClick={() => setMobileMenuOpen(false)}>Properties</a>
            <a href="#about" className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#contact" className="text-white font-medium py-2 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black flex items-center justify-center gap-2 mt-2 rounded-sm hover-scale group">
              <Phone className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Call Josh</span>
            </Button>
          </div>
        </div>}
    </header>;
};
export default Navbar;