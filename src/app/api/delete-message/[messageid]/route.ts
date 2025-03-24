import dbConnect from "@/lib/dbConnect";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/models/User";

/**
 * Handles deleting a message by its ID.
 *
 * @param {Request} request - The Request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.messageid - The ID of the message to delete.
 * @returns {Response} - A Response object.
 *
 * @throws {Error} - If there is an error deleting the message.
 */
export const DELETE = async (request: Request, {params}: { params: { messageid: string } }): Promise<Response> => {
    const messageId = params.messageid;
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

        // Find the message and remove it from the user's list of messages
        const updatedResult = await UserModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull: {
                    messages: {_id: messageId}
                }
            }
        )

        // If the message was not found, return a 404 status
        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found"
            }, {
                status: 404
            });

        }
        // Return a success response with a 200 status
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, {
            status: 200
        });
    } catch (error) {
        console.error(error);
        // Return an error response with a 500 status
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, {
            status: 500
        });
    }

}