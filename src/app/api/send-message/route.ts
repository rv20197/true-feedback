import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import MessageModel, {Message} from "@/models/Message";

/**
 * Handles sending a message to a user.
 *
 * @param {Request} request - The request object containing the username and message content.
 * @returns {Response} - The response object indicating success or error.
 *
 * @throws {Error} - If there is an error processing the request.
 */
export const POST = async (request: Request): Promise<Response> => {
    await dbConnect();

    try {
        // Extract username and message content from the request
        const {username, content} = await request.json();

        // Find the user by their username
        const user = await UserModel.findOne({username});

        // Check if the user was not found
        if (!user) {
            return Response.json({success: false, message: "User not found"}, {status: 404});
        }

        // Verify if the user is accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json({success: false, message: "User not accepting messages"}, {status: 403});
        }

        // Create a new message document
        const newMessage = new MessageModel({content});
        await newMessage.save();

        // Add the new message to the user's messages and save the user
        user.messages.push(newMessage as Message);
        await user.save();

        // Return a success response
        return Response.json({success: true, message: "Message sent successfully"}, {status: 200});
    } catch (e) {
        // Log and return an error response
        console.error("Error sending message: " + e);
        return Response.json({success: false, message: "Error sending message"}, {status: 500});
    }
}