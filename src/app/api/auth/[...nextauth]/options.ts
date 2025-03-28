import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "jsmith@example.com"},
                password: {label: "Password", type: "password"}
            },
            /**
             * This function is called when a user is attempting to sign in.
             * It must return a user object or null, depending on the result of the sign in attempt.
             * @param credentials
             */
            async authorize(credentials: any): Promise<any | null> {
                await dbConnect();
                try {
                    // Find the user by the provided email
                    const user = await UserModel.findOne({email: credentials.identifier});
                    if (!user) {
                        console.error("User not found!");
                        return null;
                    }

                    // Check if the user is verified
                    if (!user?.isVerified) {
                        console.error("Please verify your account before login");
                        return null;
                    }

                    // Validate the password
                    const isPasswordCorrect = await bcrypt.compare(credentials.password as string, user.password);
                    if (!isPasswordCorrect) {
                        console.error("Invalid credentials");
                        return null;
                    }

                    // If the user is verified and the password is correct, return the user object
                    return user;
                } catch (e: any) {
                    console.error("Authorization error: " + e.message);
                    return null;
                }
            },
        })
    ],
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        /**
         * The JWT callback is called after the user has been authenticated using the provider.
         * It is used to add custom claims to the JWT token.
         * @param token The JWT token
         * @param user The authenticated user
         */
        async jwt({token, user}) {
            if (user) {
                // Add the user's ID to the token
                token._id = user.id?.toString();
                // Add the user's verification status to the token
                token.isVerified = user.isVerified;
                // Add the user's message acceptance status to the token
                token.isAcceptingMessages = user.isAcceptingMessages;
                // Add the user's username to the token
                token.username = user.username;
                // Add the user's email address to the token
                token.email = user.email;
            }
            // Return the modified JWT token
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user = {
                    ...session.user,
                    _id: token._id,
                    isVerified: token.isVerified,
                    isAcceptingMessages: token.isAcceptingMessages,
                    username: token.username,
                    email: token.email
                };
            }
            return session;
        }
    }
}