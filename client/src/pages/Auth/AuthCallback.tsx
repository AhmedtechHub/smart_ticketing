import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/api/apiConfig';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        // Handle role-based redirection
        const userRole = (session.user as any).role;
        if (userRole === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (userRole === 'PLANNER') {
          navigate('/planner', { replace: true });
        } else {
          // Normal attendee redirects to home or intended destination
          navigate('/', { replace: true });
        }
      } else {
        // If not logged in, bounce to login
        navigate('/login', { replace: true });
      }
    }
  }, [session, isPending, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium tracking-tight">Authenticating...</h2>
      <p className="text-muted-foreground mt-2 text-sm">Please wait while we log you in securely.</p>
    </div>
  );
};

export default AuthCallback;
