import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = NextAuth({
    providers:[CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            await dbConnect();

            try{
                const user = await UserModel.findOne(
                    {
                        username: credentials.username
                    });

                if (!user){
                    throw new Error("User not found!")
                }

                if(user.isVerified){
                    throw new Error("Please verify your account before login")
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password as string,user.password);

                if(!isPasswordCorrect){
                    throw new Error("Invalid credentials");
                }

                return user;
            }catch (e: any) {
                throw new Error(e)
            }
        },
    })],
    pages:{
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token,user}){
            if(user){
                token._id = user.id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
    }
})