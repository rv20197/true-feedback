import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

/**
 * Handles requests to update the message acceptance status for a user.
 *
 * @param {Request} request - The request object containing the status to update.
 * @returns {Response} - The response object indicating success or error.
 *
 * @throws {Error} - If there is an error processing the request.
 */
export const POST = async (request: Request): Promise<Response> => {
    await dbConnect();

    try {
        // Get the current session and user information
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        // Check if the session or user is invalid
        if (!session || !user) {
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }

        // Extract the user ID and message acceptance status from the request
        const userId = new mongoose.Types.ObjectId(user._id);
        const {acceptMessages} = await request.json();

        // Update the user's message acceptance status in the database
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {$set: {isAcceptingMessages: acceptMessages}}, {new: true});

        // Check if the user was not found
        if (!updatedUser) {
            return Response.json({success: false, message: "User not found"}, {status: 404});
        }

        // Return a success response with the updated user information
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            isAcceptingMessages: updatedUser.isAcceptingMessages
        }, {status: 200});
    } catch (e) {
        // Log the error and return a server error response
        console.error("Error accepting message", e);
        return Response.json({success: false, message: "Error accepting message"}, {status: 500});
    }
}

/**
 * Retrieves the message acceptance status for a user.
 *
 * This endpoint is used to check if a user is currently accepting messages.
 * It returns a boolean value indicating whether the user is accepting messages or not.
 *
 * @returns {Response} - The response object indicating success or error.
 *
 * @throws {Error} - If there is an error processing the request.
 */
export const GET = async (): Promise<Response> => {
    await dbConnect();

    try {
        // Retrieve the current session and user information
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        // Check if the session or user is invalid
        if (!session || !user) {
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }

        // Extract the user ID from the session
        const userId = user._id;

        // Find the user by ID in the database
        const foundUser = await UserModel.findById(userId);

        // Check if the user was not found
        if (!foundUser) {
            return Response.json({success: false, message: "User not found"}, {status: 404});
        }

        // Return a success response with the user's message acceptance status
        return Response.json({
            /**
             * Indicates whether the request was successful or not.
             * @type {boolean}
             */
            success: true,
            /**
             * A message indicating the outcome of the request.
             * @type {string}
             */
            message: "User found successfully",
            /**
             * The user's message acceptance status.
             * @type {boolean}
             */
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, {status: 200});
    } catch (e) {
        // Log the error and return a server error response
        console.error("Error retrieving message acceptance status", e);
        return Response.json({
            /**
             * Indicates whether the request was successful or not.
             * @type {boolean}
             */
            success: false,
            /**
             * A message indicating the outcome of the request.
             * @type {string}
             */
            message: "Error retrieving message acceptance status"
        }, {status: 500});
    }
}