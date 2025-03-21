import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


/**
 * Verify a user by their username and verification code.
 *
 * @param {Request} request - The Request object.
 * @returns {Response} - A Response object.
 *
 * @throws {Error} - If there is an error verifying the user.
 */
export const POST = async (request: Request) => {
    await dbConnect();
    try {
        const {username, code} = await request.json();

        // Find the user by their username.
        const user = await UserModel.findOne({username});

        // Validate the user exists.
        if (!user) {
            return Response.json({success: false, message: "User not found"}, {status: 400});
        }

        // Validate the verification code.
        const isValidCode = user?.verifyCode === code;

        // Validate the verification code has not expired.
        const isCodeExpired = user?.verifyCodeExpiry && user?.verifyCodeExpiry < new Date();

        // If the verification code is invalid or has expired, return an error.
        if (!isValidCode) {
            return Response.json({success: false, message: "Invalid verification code"}, {status: 400});
        }

        if (isCodeExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, Please Sign-Up again to get a new code"
            }, {status: 400});
        }

        // Mark the user as verified.
        user.isVerified = true;
        await user.save();

        // Return the success response.
        return Response.json({success: true, message: "User verified successfully"}, {status: 200});
    } catch (e) {
        // Log the error and return a 500 status.
        console.error("Error verifying user", e);
        return Response.json({success: false, message: "Error verifying user"}, {status: 500});
    }
}