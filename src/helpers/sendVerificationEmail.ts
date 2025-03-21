import VerificationEmail from "../../emails/VerificationEmail";
import {resend} from "@/lib/resend";
import {ApiResponse} from "@/types/ApiResponse";

/**
 * Sends a verification email to the given email address with the given username and verification code
 * @param {string} email - The email address to send the verification email to
 * @param {string} username - The username associated with the email address
 * @param {string} verifyCode - The verification code to include in the email
 * @returns {Promise<ApiResponse>} - The response object with the success status and the message
 */
export const sendVerificationEmail = async (email: string, username: string, verifyCode: string): Promise<ApiResponse> => {
    try {
        // Send the verification email using resend
        await resend.emails.send({
            // Set the from address to the onboarding email
            from: 'Acme <onboarding@resend.dev>',
            // Set the to address to the supplied email
            to: email,
            // Set the subject of the email to "True Feedback - Verification Code"
            subject: 'True Feedback - Verification Code',
            // Use the VerificationEmail component to generate the email body
            react: VerificationEmail({username, verifyCode}),
        });
        // Return a successful response with a message and the isAcceptingMessages flag set to true
        return {success: true, message: "Verification email sent successfully", isAcceptingMessages: true};
    } catch (e) {
        // Log any errors to the console
        console.error("Error sending verification email", e);
        // Return an error response with a message
        return {success: false, message: "Error sending verification email"};
    }
}