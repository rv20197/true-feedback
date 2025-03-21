import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export const POST = async (request: Request) => {
    await dbConnect();
    try {
        const {username, code} = await request.json();
        const user = await UserModel.findOne({username});
        const isValidCode = user?.verifyCode === code;
        const isCodeExpired = user?.verifyCodeExpiry && user?.verifyCodeExpiry < new Date();
        if (!user) {
            return Response.json({success: false, message: "User not found"}, {status: 400});
        }

        if (!isValidCode) {
            return Response.json({success: false, message: "Invalid verification code"}, {status: 400});
        }

        if (isCodeExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, Please Sign-Up again to get a new code"
            }, {status: 400});
        }

        user.isVerified = true;
        await user.save();
        return Response.json({success: true, message: "User verified successfully"}, {status: 200});
    } catch (e) {
        console.error("Error verifying user", e);
        return Response.json({success: false, message: "Error verifying user"}, {status: 500});
    }
}