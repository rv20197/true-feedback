import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request) => {
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
           if(existingUserByEmail.isVerified){
               return Response.json({success: false, message: "User already exists with same email"},{status:400});
           }else {
               const hashedPassword = await bcrypt.hash(password,32);
               const expiryDate = new Date();
               expiryDate.setHours(expiryDate.getHours()+1);

               existingUserByEmail.password = hashedPassword;
               existingUserByEmail.verifyCode = verifyCode;
               existingUserByEmail.verifyCodeExpiry = expiryDate;

               await existingUserByEmail.save();
               return Response.json({success: true, message: "User updated successfully"},{status:200});
           }
        }else {
           const hashedPassword = await bcrypt.hash(password,10);
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