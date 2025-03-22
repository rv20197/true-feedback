import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import {userNameValidation} from "@/schemas/signUp.schema";
import UserModel from "@/models/User";

const userNameQuerySchema = z.object({
    username: userNameValidation
});

/**
 * Checks if a username is unique.
 *
 * @param {Request} request - The Request object.
 * @returns {Response} - A Response object.
 *
 * @throws {Error} - If there is an error checking if the username is unique.
 */
export const GET = async (request: Request) => {
    // Connect to the database
    await dbConnect();

    try {
        // Get the username parameter from the query string
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        // Validate the username parameter
        const result = userNameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            // Return a 400 status code with an error message if the username is invalid
            return Response.json({success: false, message: result.error.format().username?._errors}, {status: 400});
        }
        // Check if the username is already taken
        const existingUser = await UserModel.findOne({username: result.data.username, isVerified: true});
        if (existingUser) {
            // Return a 400 status code with an error message if the username is taken
            return Response.json({success: false, message: "Username is already taken"}, {status: 400});
        }
        // Return a 200 status code with a success message if the username is unique
        return Response.json({success: true, message: "Username is available"}, {status: 200});
    } catch (e) {
        // Catch any errors that occur and log them
        console.error('Error checking unique username', e);
        // Return a 500 status code with an error message
        return Response.json({success: false, message: "Error checking unique username"}, {status: 500});
    }
};