import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Mail, Lock, User, Eye, EyeOff, Key } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const INVITE_CODE = "Brotivator!";
const INVITE_CODE_STORAGE_KEY = "invite_code_verified";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already verified the invite code
    const verified = localStorage.getItem(INVITE_CODE_STORAGE_KEY) === 'true';
    setIsVerified(verified);
    
    if (!verified) {
      setInviteDialogOpen(true);
    }
    
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is logged in, make sure they've verified the invite code
        if (verified) {
          navigate('/admin');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        navigate('/admin');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Josh Rader',
            }
          }
        });

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Your account has been created. Please check your email for confirmation.",
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleVerifyInviteCode = () => {
    if (inviteCode === INVITE_CODE) {
      localStorage.setItem(INVITE_CODE_STORAGE_KEY, 'true');
      setIsVerified(true);
      setInviteDialogOpen(false);
      toast({
        title: "Success!",
        description: "Invite code verified successfully.",
      });
      
      toast({
        title: "Chat Assistant Available",
        description: "You can now access our real estate chat assistant!",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid invite code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-16">
        {isVerified && (
          <div className="max-w-md mx-auto mb-8">
            <Button
              onClick={navigateToChat}
              className="w-full bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark py-6 text-lg"
            >
              Access Real Estate Chat Assistant
            </Button>
          </div>
        )}
        
        <div className={`max-w-md mx-auto luxury-card p-8 ${!isVerified ? 'blur-sm pointer-events-none' : ''}`}>
          <h1 className="text-2xl font-bold text-center mb-8">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-luxury-khaki" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-luxury-khaki" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5 text-luxury-khaki hover:text-luxury-gold transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-luxury-gold hover:text-luxury-khaki underline text-sm transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </main>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} modal={true}>
        <DialogContent 
          className="sm:max-w-md" 
          onPointerDownOutside={(e) => e.preventDefault()} 
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Enter Invite Code</DialogTitle>
            <DialogDescription className="text-center">
              This area is restricted. Please enter your invite code to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-5 w-5 text-luxury-khaki" />
              <Input
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleVerifyInviteCode}
              className="w-full bg-luxury-gold hover:bg-luxury-khaki text-luxury-dark"
            >
              Verify Code
            </Button>
            <div className="text-center text-sm mt-4">
              <p>After verification, you'll be able to access the Real Estate Chat Assistant.</p>
            </div>
          </div>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-default"
            onClick={() => navigate('/')}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Auth;
