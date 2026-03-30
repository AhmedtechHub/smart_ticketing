const { betterAuth } = require("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const prisma = require("./db");
const { sendEmail } = require("../services/emailService");

const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    trustedOrigins: [
        process.env.CLIENT_URL || "http://localhost:5173",
        process.env.CORS_ORIGIN || "http://localhost:5173",
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    // Customize Email flows for Better-Auth
    emailVerification: {
        sendOnSignUp: true,
        sendEmail: async ({ user, url, token }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify your email - Smart Ticketing",
                title: "Security Verification",
                htmlContent: `<p>Hello ${user.name || 'there'},</p><p>Please use the button below to verify your email address and secure your account.</p>`,
                buttonText: "Verify Email",
                buttonUrl: url,
            });
        },
    },
    forgetPassword: {
        sendEmail: async ({ user, url, token }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your password - Smart Ticketing",
                title: "Password Reset Request",
                htmlContent: `<p>Hello ${user.name || 'there'},</p><p>You requested a password reset. Click the button below to choose a new password. If you didn't request this, you can safely ignore this email.</p>`,
                buttonText: "Reset Password",
                buttonUrl: url,
            });
        },
    },
    session: {
        jwt: {
            enable: true,
        },
        expiresIn: 60 * 60 * 24 * 7,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "ATTENDEE",
            }
        }
    }
});


module.exports = auth;
