import VerificationEmail from "../../emails/VerificationEmail";
import {resend} from "@/lib/resend";
import {ApiResponse} from "@/types/ApiResponse";

export const sendVerificationEmail = async (email: string, username:string,verifyCode:string): Promise<ApiResponse> => {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'True Feedback - Verification Code',
            react: VerificationEmail({username, verifyCode}),
        });
        return {success: true, message: "Verification email sent successfully", isAcceptingMessage: true};
    } catch (e) {
        console.error("Error sending verification email", e);
        return {success: false, message: "Error sending verification email"};
    }
}