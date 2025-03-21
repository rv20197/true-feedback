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
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any | null> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({username: credentials.username});
                    if (!user) {
                        console.error("User not found!");
                        return null;
                    }
                    if (!user?.isVerified) {
                        console.error("Please verify your account before login");
                        return null;
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password as string, user.password);
                    if (!isPasswordCorrect) {
                        console.error("Invalid credentials");
                        return null;
                    }
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
        async jwt({token, user}) {
            if (user) {
                token._id = user.id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
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
                };
            }
            return session;
        }
    }
}