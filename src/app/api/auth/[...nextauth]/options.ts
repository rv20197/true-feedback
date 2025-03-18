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
        async authorize(credentials):Promise<void> {
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

                const isPasswordCorrect:Promise<boolean> = await bcrypt.compare(credentials.password,user.password);

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
    }
})