import { authClient } from './apiConfig';

/**
 * Authentication Helper Service
 * Wraps Better-Auth client for common operations
 */
export const authService = {
    signUp: async (data: any) => {
        return await authClient.signUp.email(data);
    },
    
    signIn: async (data: any) => {
        return await authClient.signIn.email(data);
    },

    signInWithGoogle: async (callbackPath: string = "/auth/callback") => {
        const callbackURL = `${window.location.origin}${callbackPath}`;
        return await authClient.signIn.social({
            provider: "google",
            callbackURL
        });
    },

    signOut: async () => {
        return await authClient.signOut();
    },

    getSession: async () => {
        return await authClient.getSession();
    },

    forgetPassword: async (email: string) => {
        // better-auth's forgot password endpoint - sends a reset link
        return await (authClient as any).forgetPassword({
            email,
            redirectTo: "/reset-password"
        });
    }
};
