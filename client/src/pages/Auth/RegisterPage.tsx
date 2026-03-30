import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/api/auth';
import { Loader2, ArrowRight, User, Mail, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await authService.signUp({
        email,
        password,
        name,
      });

      if (error) {
        setError(error.message || 'Registration failed. Please try again.');
      } else {
        navigate('/login?verify=true');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await authService.signInWithGoogle('/auth/callback');
    } catch (err) {
      setError('Google registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <Link to="/" className="group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
              <img 
                src="https://res.cloudinary.com/dvkt0lsqb/image/upload/v1773771501/Smart_Ticketing_Logo_o9qzbh.png" 
                alt="Logo" 
                className="h-14 w-auto relative z-10 brightness-110"
              />
            </div>
          </Link>
          <h1 className="text-4xl font-serif font-medium text-foreground tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join us and start discovering extraordinary events</p>
        </div>

        <Card className="glass-effect border-white/20 dark:border-white/10 shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-1 pb-6 text-center lg:text-left">
            <CardTitle className="text-xl font-semibold">Join SmartTicketing</CardTitle>
            <CardDescription>
              Build your personalized event hub in seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                onClick={handleGoogleRegister} 
                className="h-12 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all gap-3 rounded-xl"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
                Start with Google
              </Button>
            </div>
            
            {/* 
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/50 px-2 text-muted-foreground backdrop-blur-sm">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 rounded-xl border-white/20 bg-white/5 pl-11 focus-visible:ring-primary/30"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-white/20 bg-white/5 pl-11 focus-visible:ring-primary/30"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-white/20 bg-white/5 pl-11 focus-visible:ring-primary/30"
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <Button type="submit" className="h-12 w-full font-bold shadow-lg shadow-primary/25 rounded-xl gap-2 mt-2" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>
            */}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border/30 pt-6 pb-8 text-center uppercase">
            <p className="text-center text-[10px] tracking-widest text-muted-foreground font-bold px-8 leading-tight">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="text-center text-sm text-muted-foreground px-8 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
