import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";

/**
 * Handles registration of a new user
 *
 * @param {Request} request - The request object.
 * @returns {Response} - A response object.
 *
 * @throws {Error} - If there is an error registering a user.
 */
export const POST = async (request: Request) => {
    await dbConnect(); // Connect to the database

    try {
        const {username, email, password} = await request.json();
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code

        // Check if a verified user with the same username already exists
        const existingUserVerifiedByUserName = await UserModel.findOne({username, isVerified: true});
        if (existingUserVerifiedByUserName) {
            return Response.json({success: false, message: "Username is already taken"}, {status: 400});
        }

        // Check if a user with the same email already exists
        const existingUserByEmail = await UserModel.findOne({email});
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({success: false, message: "User already exists with same email"}, {status: 400});
            } else {
                // Update existing unverified user's details
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // Set verification code expiry to 1 hour from now

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();
                return Response.json({success: true, message: "User updated successfully"}, {status: 200});
            }
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // Set verification code expiry to 1 hour from now

            const newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({success: false, message: emailResponse.message}, {status: 500});
        }

        return Response.json({
            success: true,
            message: "User Registered successfully, Please verify your email"
        }, {status: 201});
    } catch (e) {
        console.error('Error registering user', e); // Log error
        return Response.json({success: false, message: "Error registering user"}, {status: 500});
    }
}