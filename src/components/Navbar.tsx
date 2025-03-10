
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, BookText, LogIn, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth"
        });
        setMobileMenuOpen(false);
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/admin');
    } else {
      navigate('/auth');
    }
  };

  const isAdminPage = location.pathname.includes('/admin');
  const navbarClass = isAdminPage 
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 admin-header py-3`
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-luxury-black shadow-md py-2' : 'bg-transparent py-4'}`;

  return <header className={navbarClass}>
      <nav className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 text-white group">
            <img 
              src="/lovable-uploads/ef3a3919-83aa-4b7d-8d5f-a9753d6114f0.png" 
              alt="Josh Rader" 
              className="h-12 w-auto group-hover:scale-110 transition-transform drop-shadow-md"
            />
          </a>
          
          <a href="https://mccullarproperties.com/" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 border-l border-luxury-gold/30 pl-4 group hover:bg-luxury-charcoal/30 transition-all p-1 rounded">
            <img alt="McCullar Properties Group" className="h-8 w-auto group-hover:scale-105 transition-transform drop-shadow-sm" src="/lovable-uploads/bda42a85-fa69-47e4-b7d2-1900e3411ffb.png" />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {!isAdminPage ? (
            <>
              <a href="#services" onClick={e => handleScrollToSection(e, 'services')} className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow drop-shadow-md">
                Services
              </a>
              <a href="#properties" onClick={e => handleScrollToSection(e, 'properties')} className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow drop-shadow-md">
                Properties
              </a>
              <a href="#about" onClick={e => handleScrollToSection(e, 'about')} className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow drop-shadow-md">
                About
              </a>
              <a href="#blogs" onClick={e => handleScrollToSection(e, 'blogs')} className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow drop-shadow-md">
                Blog
              </a>
              <a href="#contact" onClick={e => handleScrollToSection(e, 'contact')} className="text-white hover:text-luxury-gold font-medium transition-colors uppercase text-sm tracking-wider hover-underline-grow drop-shadow-md">
                Contact
              </a>
              <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black flex items-center gap-2 rounded-sm hover-scale group">
                <Phone className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                <span>Call Josh</span>
              </Button>
            </>
          ) : (
            <div className="text-white/80 font-medium flex items-center gap-2">
              <BookText className="h-4 w-4 text-luxury-gold" />
              <span className="uppercase tracking-wider text-sm">Blog Management</span>
            </div>
          )}
          <Button 
            onClick={handleAuthClick}
            variant="outline" 
            className="text-luxury-gold hover:text-luxury-black hover:bg-luxury-gold border-luxury-gold flex items-center gap-2 rounded-sm hover-scale group"
          >
            {user ? (
              <>
                <User className="h-4 w-4" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </>
            )}
          </Button>
        </div>

        <button className="md:hidden text-white hover:text-luxury-gold transition-colors hover-scale" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && <div className="md:hidden bg-luxury-dark py-4 border-t border-luxury-khaki/20 animate-fade-in">
          <div className="container flex flex-col gap-4">
            <a href="https://mccullarproperties.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 border-b border-luxury-khaki/10 group hover:bg-luxury-charcoal/30 transition-all p-2 rounded">
              <span className="text-luxury-khaki text-xs uppercase tracking-wide group-hover:text-luxury-gold transition-colors">Proudly Brokered By</span>
              <img alt="McCullar Properties Group" className="h-6 w-auto group-hover:scale-105 transition-transform" src="/lovable-uploads/6635c4f1-9b1d-4ef5-949a-4b78d5df568e.png" />
            </a>
            <a href="#services" onClick={e => handleScrollToSection(e, 'services')} className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all">
              Services
            </a>
            <a href="#properties" onClick={e => handleScrollToSection(e, 'properties')} className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all">
              Properties
            </a>
            <a href="#about" onClick={e => handleScrollToSection(e, 'about')} className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all">
              About
            </a>
            <a href="#blogs" onClick={e => handleScrollToSection(e, 'blogs')} className="text-white font-medium py-2 border-b border-luxury-khaki/10 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all">
              Blog
            </a>
            <a href="#contact" onClick={e => handleScrollToSection(e, 'contact')} className="text-white font-medium py-2 uppercase text-sm tracking-wider hover:pl-2 hover:text-luxury-gold transition-all">
              Contact
            </a>
            <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black flex items-center justify-center gap-2 mt-2 rounded-sm hover-scale group">
              <Phone className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Call Josh</span>
            </Button>
            <Button 
              onClick={handleAuthClick}
              variant="outline" 
              className="text-luxury-gold hover:text-luxury-black hover:bg-luxury-gold border-luxury-gold flex items-center justify-center gap-2 mt-2 rounded-sm hover-scale group"
            >
              {user ? (
                <>
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </>
              )}
            </Button>
          </div>
        </div>}
    </header>;
};

export default Navbar;
