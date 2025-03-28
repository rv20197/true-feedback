import dbConnect from "@/lib/dbConnect";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";

/**
 * GET /api/get-messages
 *
 * Retrieves the messages for a user.
 *
 * @returns {Response} - The response object indicating success or error.
 *
 * @throws {Error} - If there is an error processing the request.
 */
export const GET = async (): Promise<Response> => {
    await dbConnect();

    try {
        // Get the current session and user information
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        // Check if the session or user is invalid
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            });
        }

        // Extract the user ID from the session
        const userId = new mongoose.Types.ObjectId(user._id);

        // Find the user by ID in the database
        const foundUser = await UserModel.findById(userId);

        // Check if the user was not found
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }

        // Retrieve the messages for the user
        const userMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: foundUser._id
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: '$messages'
                    }
                }
            }
        ]);

        // Check if the user messages were not found
        if (userMessages.length === 0) {
            return Response.json({
                success: false,
                message: "User messages not found"
            }, {
                status: 404
            });
        }

        // Return the success response with the messages
        return Response.json({
            success: true,
            messages: userMessages?.[0].messages
        }, {
            status: 200
        });
    } catch (e) {
        // Log the error and return a server error response
        console.error("Error getting messages: " + e);
        return Response.json({
            success: false,
            message: "Error getting messages"
        }, {
            status: 500
        });
    }
}