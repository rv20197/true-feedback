import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";
import {ifError} from "node:assert";
import {Message} from "@/models/Message";

export const POST = async (request: Request, response: Response) => {
    await dbConnect();

    try{
        const {username, email, password} = await request.json();
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        const existingUserVerifiedByUserName = await UserModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUserName){
            return Response.json({success: false, message: "Username is already taken"},{status:400});
        }

        const existingUserByEmail = await UserModel.findOne({email});

        if(existingUserByEmail){
           true;
        }else {
           const hashedPassword = await bcrypt.hash(password,32);
           const expiryDate = new Date();
           expiryDate.setHours(expiryDate.getHours()+1);

           const newUser = new UserModel({
               username,
               password: hashedPassword,
               email,
               verifyCode,
               verifyCodeExpiry: expiryDate,
               isVerified: false,
               isAcceptingMessage: true,
               messages: []
           });

           await newUser.save();
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if(!emailResponse.success){
            return Response.json({success: false, message: emailResponse.message},{status:500});
        }

        return Response.json({success: true, message: "User Registered successfully, Please verify your email"},{status:201});
    }catch (e) {
        console.error('Error registering user', e);
        return Response.json({success: false, message: "Error registering user"},{status: 500});
    }
}